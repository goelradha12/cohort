import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,
    isLoggingOut: false,
    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axiosInstance.get("/auth/getProfile");
            set({ authUser: response.data.data, isCheckingAuth: false });
        } catch {
            set({ authUser: null, isCheckingAuth: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            await axiosInstance.post("/auth/register", data);
            toast.success("Verification link sent on Email"); // reflecting a pop-up message
        } catch (error) {
            // console.log("Error signing up: ", error);
            toast.error( error.response?.data?.message || "Error signing up");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.data });
            toast.success(res.data.message || "User logged in successfully");
        } catch (error) {
            toast.error( error.response?.data?.message || "Error Logging")
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.get("/auth/logout");
        } catch (error) {
            // Even if the server call fails (e.g. already logged out), we still
            // clear client auth below — logging out should always succeed locally.
            console.log("Logout request error: ", error);
        } finally {
            // Always end up logged out on the client.
            set({ authUser: null, isLoggingOut: false });
            // Fixed toast id so react-hot-toast replaces rather than stacks
            // duplicates if logout is triggered more than once.
            toast.success("Logged out", { id: "logout" });
        }
    }
}));
