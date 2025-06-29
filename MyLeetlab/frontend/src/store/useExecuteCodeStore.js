import { create } from "zustand";

export const useExecuteCodeStore = create((set) => ({
    isExecutingCode: false,
    executionResult: null,
    isRunningCode: false,
    runCodeResult: null,
    executeCode: async ({source_code, language_id, stdin, expected_outputs, problemId}) => {
        try {
            set({isExecutingCode: true});
            const res = await axiosInstance.post("/execute-code", {source_code, language_id, stdin, expected_outputs, problemId});
            set({executionResult: res.data.data});
            toast.success(res.data.message || "Code executed successfully");
        } catch (error) {
            console.log("Error executing code: ", error);
            toast.error(error.response.data.message || "Error executing code");
        } finally {
            set({isExecutingCode: false});
        }
    },

    runCode: async ({source_code, language_id, stdin, expected_outputs, problemId}) => {
        try {
            set({isRunningCode: true});
            const res = await axiosInstance.post("/execute-code/run", {source_code, language_id, stdin, expected_outputs, problemId});
            set({runCodeResult: res.data.data});
            toast.success(res.data.message || "Code executed successfully");
        } catch (error) {
            console.log("Error executing code: ", error);
            toast.error(error.response.data.message || "Error Running code");
        } finally {
            set({isRunningCode: false});
        }
    }
}))