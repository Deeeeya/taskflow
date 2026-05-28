import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" /> // this instantly sends the user to the login page if they aren't logged in
    } else {
        return <>{children}</> // the '<> </>' are called a Fragment. It's an invisible wrapper that renders its children without adding any extra HTML element to the page. it just renders whatever the page was passed in as children normally
    }
}

export default ProtectedRoute