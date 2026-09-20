import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

// Supported languages come from the backend (GET /languages), which derives them
// from judge0lib — the single source of truth. Each entry: { key, id, label, monaco }.
export const useLanguageStore = create((set) => ({
    languages: [],
    isLanguagesLoading: false,

    fetchLanguages: async () => {
        try {
            set({ isLanguagesLoading: true });
            const response = await axiosInstance.get("/languages");
            set({ languages: response.data.data });
        } catch (error) {
            console.log("Error fetching languages: ", error);
            toast.error(error?.response?.data?.message || "Error fetching languages");
        } finally {
            set({ isLanguagesLoading: false });
        }
    },
}));
