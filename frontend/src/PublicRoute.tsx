import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }: { children: ReactElement }) => {
    const token = window.localStorage.getItem("token");

    return token ? <Navigate to="/dashboard" replace /> : children;
};

export default PublicRoute;