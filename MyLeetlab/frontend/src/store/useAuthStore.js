import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSignUp: false,
    isLoggingIn: false,
    isCheckingAuth: false,

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
        set({ isSignUp: true });
        try {
            const res = await axiosInstance.post("/auth/register", data);
            set({ authUser: res.data.data });

            toast.success(res.data.message); // reflecting a pop-up message
        } catch (error) {
            console.log("Error signing up: ", error);
            toast.error("Error signing up");
        } finally {
            set({ isSignUp: false });
        }
    },
}));
