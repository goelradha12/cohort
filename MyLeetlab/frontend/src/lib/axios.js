import axios from "axios"
import toast from "react-hot-toast"

// Resolve the API base URL (remediation item 8).
// Priority:
//   1. VITE_API_URL when provided at build time (explicit prod/staging config).
//   2. In development, default to the local backend.
//   3. Otherwise fall back to the same-origin `/api/v1` path (assumes a reverse
//      proxy rewrites it to the backend).
const resolveBaseURL = () => {
    const explicit = import.meta.env.VITE_API_URL;
    if (explicit) return explicit;

    return import.meta.env.MODE === "development"
        ? "http://localhost:3000/api/v1"
        : "/api/v1";
};

export const axiosInstance = axios.create({
    baseURL: resolveBaseURL(),
    withCredentials: true
})

// ---------------------------------------------------------------------------
// Response interceptor: silent access-token refresh + rate-limit feedback.
//
// - 401 (expired/invalid access token): try GET /auth/refreshAccessToken ONCE,
//   then replay the original request. Concurrent 401s share a single in-flight
//   refresh so we don't hammer the endpoint. If refresh fails, clear auth.
// - 429 (rate limited): show a "slow down" toast and reject.
//
// Guards against infinite loops: the refresh call itself is never retried, and
// each request is retried at most once (marked via _retry).
// ---------------------------------------------------------------------------

const REFRESH_URL = "/auth/refreshAccessToken";

// A single shared refresh promise so parallel 401s trigger only one refresh call.
let refreshPromise = null;

// Called when refresh fails / session is truly over. Clears auth state without a
// static import of the store (avoids a circular dependency).
const clearAuthState = async () => {
    try {
        const { useAuthStore } = await import("../store/useAuthStore.js");
        useAuthStore.setState({ authUser: null });
    } catch {
        // Store not available; ignore.
    }
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { response, config } = error;

        // Network error or no response — pass through.
        if (!response || !config) {
            return Promise.reject(error);
        }

        const status = response.status;
        const requestUrl = config.url || "";

        // Rate limited: surface a clear message, don't retry.
        if (status === 429) {
            toast.error(
                response.data?.message || "Too many requests. Please slow down and try again shortly."
            );
            return Promise.reject(error);
        }

        // Access token likely expired: attempt a one-time refresh + replay.
        // Skip auth endpoints that legitimately 401 without meaning "expired":
        // the refresh call itself, the initial getProfile probe, and logout
        // (logging out should never trigger a token refresh).
        const isRefreshCall = requestUrl.includes(REFRESH_URL);
        const isAuthProbe = requestUrl.includes("/auth/getProfile");
        const isLogout = requestUrl.includes("/auth/logout");
        if (status === 401 && !config._retry && !isRefreshCall && !isAuthProbe && !isLogout) {
            config._retry = true;
            try {
                // Share one refresh across concurrent 401s.
                if (!refreshPromise) {
                    refreshPromise = axiosInstance.get(REFRESH_URL).finally(() => {
                        refreshPromise = null;
                    });
                }
                await refreshPromise;
                // Refresh succeeded (new accessToken cookie set) — replay original.
                return axiosInstance(config);
            } catch (refreshError) {
                // Refresh failed — session is over. Clear auth and propagate.
                await clearAuthState();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
