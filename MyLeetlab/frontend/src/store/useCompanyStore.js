import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useCompanyStore = create((set, get) => ({
    companies: [],
    isCompaniesLoading: false,
    isCreatingCompany: false,

    fetchCompanies: async () => {
        try {
            set({ isCompaniesLoading: true });
            const response = await axiosInstance.get("/companies");
            set({ companies: response.data.data });
        } catch (error) {
            console.log("Error fetching companies: ", error);
            toast.error(error?.response?.data?.message || "Error fetching companies");
        } finally {
            set({ isCompaniesLoading: false });
        }
    },

    // Admin-only. Find-or-create on the backend by normalized name; returns the
    // company object ({ id, name }) so the caller can use the id immediately.
    createCompany: async (name) => {
        try {
            set({ isCreatingCompany: true });
            const response = await axiosInstance.post("/companies", { name });
            const company = response.data.data;
            // Merge into the local list if it's new (avoid duplicate entries).
            const existing = get().companies;
            if (!existing.some((c) => c.id === company.id)) {
                set({
                    companies: [...existing, { id: company.id, name: company.name }].sort(
                        (a, b) => a.name.localeCompare(b.name)
                    ),
                });
            }
            return company;
        } catch (error) {
            console.log("Error creating company: ", error);
            toast.error(error?.response?.data?.message || "Error creating company");
            return null;
        } finally {
            set({ isCreatingCompany: false });
        }
    },
}));
