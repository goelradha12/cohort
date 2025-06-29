import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"


export const useProblemStore = create((set) => {
    return {
        problems: [],
        problem: null,
        solvedProblems: [],
        isProblemsLoading: false,
        isProblemLoading: false,

        getAllProblem: async() => {
            try {
                set({isProblemsLoading: true})
                const response = await axiosInstance.get("/problems/");
                set({problems: response.data.data})
            } catch (error) {
                console.log("Error fetching problems",error);
                toast.error("Error fetching all problems")
            } finally {
                set({isProblemsLoading: false})
            }
        },
        getProblemById: async(id) => {
            try {
                set({isProblemLoading: true});
                const res = await axiosInstance.get(`/problems/${id}`)
                set({problem: res.data.data})
                toast.success("Problem Fetched")
            } catch (error) {
                console.log("Error getting the problem: ",error)
                set({problem: null})
                // displaying error msgs from backend
                toast.error(error.response.data.message || "Error fetching Problem")  
            } finally {
                set({isProblemLoading: false})
            }
        },
        getSolvedProblemByUser: async() => {
            try {
                const res = await axiosInstance.get("/problems/get-solved-problems");
                console.log("Solved Problems: ",res.data.data);
                set({solvedProblems: res.data.data})
            } catch (error) {
                console.log("Error getting the problem: ",error)
            } 
        }
    }

})