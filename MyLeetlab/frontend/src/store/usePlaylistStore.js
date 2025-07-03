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
            const response = await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {problemIds});
            toast.success(response?.data?.message || "Problem added")
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error Adding Problem")
        }
    },

    removeProblemFromPlaylist: async (playlistId, data) => {
        try {
            console.log("Store:",data)
            const response = await axiosInstance.patch(`/playlist/${playlistId}/remove-problem`, data);
            toast.success(response?.data?.message || "Problem removed")
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error Removing Problem")
        } 
    },

    createNewPlaylist: async (data) => {
        try {
            const response = await axiosInstance.post("/playlist", data);
            set({playlist: response.data.data})
            toast.success(response?.data?.message || "Playlist created successfully");
        } catch (error) {
            console.log("Error fetching playlists: ",error);
            toast.error(error.response?.data?.message || "Error creating the playlist");
        } 
    },

    editAPlaylist: async (id, data) => {
      try {
        const response = await axiosInstance.patch(`/playlist/${id}`, data);
        toast.success(response?.data?.message || "Playlist edited successfully");
      }  catch(error) {
        console.log("Error fetching playlists: ",error);
        toast.error(error.response?.data?.message || "Error editing the playlist");
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
            const response = await axiosInstance.delete(`/playlist/${id}`);
            toast.success(response?.data?.message || "Playlist deleted successfully");
        } catch (error) {
            console.log("Error deleting playlists: ",error);
            toast.error(error.response?.data?.message || "Error deleting the playlist");
        }  
    }
}))