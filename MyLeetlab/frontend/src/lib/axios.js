import axios from "axios"

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
