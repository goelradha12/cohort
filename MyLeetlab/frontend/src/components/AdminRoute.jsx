import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { Loader } from "lucide-react";

const AdminRoute = () => {
    const { authUser, isCheckingAuth } = useAuthStore();
    if (isCheckingAuth) {
        return <div className="flex items-center justify-center h-screen"><Loader className="size-10 animate-spin" /></div>
    }
    if(!authUser)
        return <Navigate to="/login" />
    if (authUser.role !== "ADMIN") {
        return <Navigate to="/" />;
    }
    return <Outlet />
}

export default AdminRoute