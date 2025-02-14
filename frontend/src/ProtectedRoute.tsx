import { ReactElement } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
    const token = window.localStorage.getItem("token");

    return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;