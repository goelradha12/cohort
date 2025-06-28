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
        } catch (error) {
            console.log(error);
            set({ authUser: null, isCheckingAuth: false });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data.data });

            toast.success("Verification link sent on Email"); // reflecting a pop-up message
        } catch (error) {
            // console.log("Error signing up: ", error);
            toast.error("Error signing up");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data.data });
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error logging in: ", error)
            toast.error("Error Logging")
        } finally {
            set({ isLoggingIn: false })
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            const res = await axiosInstance.get("/auth/logout");
            set({ authUser: null });
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error logging out: ", error);
            toast.error("Error logging out");
        } finally {
            set({ isLoggingOut: false });
        }
    }
}));
