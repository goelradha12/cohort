import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useSubmissionStore = create((set)=> {
    return {
        submissions: [],
        problemSubmissionCountByAllUser: 0,
        submissionsByProblemID: [],
        gettingSubmissions: false,
        gettingProblemSubCountByAllUser: false,
        gettingSubmissionByProblemID: false,

        getProblemSubCountByAllUser: async (id) => {
          try {
            set({gettingProblemSubCountByAllUser: true});
            const response = await axiosInstance(`submission/get-submission-count/${id}`);
            set({problemSubmissionCountByAllUser: response.data.data});
          } catch (error) {
            console.log("Error fetching submissions: ",error);
          } finally {
            set({gettingProblemSubCountByAllUser: false});
          }
        },

        getAllSubmission: async () =>{
            try {
                set({gettingSubmissions: true});
                const response = await axiosInstance.get("/submission/");
                set({submissions: response.data.data});
            } catch (error) {
                console.log("Error fetching submissions: ",error);
                toast.error(error.response.data.message || "Error fetching submissions");
            } finally {
                set({gettingSubmissions: false});
            }
        },

        getSubmissionByProblemID: async (id) => {
            try {
                set({gettingSubmissionByProblemID: true});
                const response = await axiosInstance.get(`/submission/${id}`);
                set({submissionsByProblemID: response.data.data});
            } catch (error) {
                console.log("Error fetching submissions: ",error);
                toast.error(error.response.data.message || "Error fetching submissions");
            } finally {
                set({gettingSubmissionByProblemID: false});
            }
        }

    }
})