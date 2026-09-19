import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useLeaderboardStore = create((set) => ({
    leaderboard: [],
    isLeaderboardLoading: false,

    fetchLeaderboard: async () => {
        try {
            set({ isLeaderboardLoading: true });
            const response = await axiosInstance.get("/leaderboard");
            set({ leaderboard: response.data.data });
        } catch (error) {
            console.log("Error fetching leaderboard: ", error);
            toast.error(error?.response?.data?.message || "Error fetching leaderboard");
        } finally {
            set({ isLeaderboardLoading: false });
        }
    },
}));
