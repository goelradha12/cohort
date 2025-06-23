import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

const LogoutButton = ({ children }) => {
    const { logout, isLoggingOut } = useAuthStore();

    const onLogout = async () => {
        await logout();
    };

    return (
        <button
            className="btn btn-primary"
            onClick={onLogout}
            disabled={isLoggingOut}
        >
            {isLoggingOut ?
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading...
                </>
                : children}
        </button>
    );
};

export default LogoutButton;
