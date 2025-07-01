import { create } from "zustand"
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const usePlaylistStore = create((set)=> ({
    playlists: [],
    isFetchingPlaylists: false,
    playlist: null,
    isFetchingPlaylist: false,

    fetchPlaylists: async () => {
        try {
            set({isFetchingPlaylists: true});
            const response = await axiosInstance.get("/playlist");
            set({playlists: response.data.data});
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error fetching playlists");
        } finally {
            set({isFetchingPlaylists: false});
        }
    },

    addProblemToPlaylist: async (playlistId, problemIds) => {
        try {
            set({isFetchingPlaylist: true});
            const response = await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {problemIds});
            toast.success(response?.data?.message || "Problem added")
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error Adding Problem")
        } finally {
            set({isFetchingPlaylist: false});
        }
    },

    removeProblemFromPlaylist: async (playlistId, problemIds) => {
        try {
            set({isFetchingPlaylist: true});
            const response = await axiosInstance.delete(`/playlist/${playlistId}/remove-problem`,{problemIds});
            toast.success(response?.data?.message || "Problem removed")
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error Removing Problem")
        } finally {
            set({isFetchingPlaylist: false});
        }
    },

    createNewPlaylist: async (data) => {
        try {
            set({isFetchingPlaylist: true});
            const response = await axiosInstance.post("/playlist", data);
            set({playlist: response.data.data})
            toast.success(response?.data?.message || "Playlist created successfully");
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error creating the playlist");
        } finally {
            set({isFetchingPlaylist: false});
        }
    },

    fetchAPlaylist: async (id) => {
        try {
            set({isFetchingPlaylist: true});
            const response = await axiosInstance.get(`/playlist/${id}`);
            set({playlist: response.data.data})
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error fetching the playlist");
        } finally {
            set({isFetchingPlaylist: false});
        }
    },

    deleteAPlaylist: async (id) => {
        try {
            set({isFetchingPlaylist: true});
            const response = await axiosInstance.delete(`/playlist/${id}`);
            toast.success(response?.data?.message || "Playlist deleted successfully");
        } catch (error) {
            console.log("Error deleting playlists: ",error);
            toast.error(error.response?.data?.message || "Error deleting the playlist");
        } finally {
            set({isFetchingPlaylist: false});
        }
    }
}))