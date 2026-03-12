import { Navigate, useLocation } from "react-router-dom";
import { pabAdminStorage } from "./storage";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    const isAuthed = pabAdminStorage.auth.isAuthed();
    const location = useLocation();

    if (!isAuthed) {
        return <Navigate to="/pab-admin/login" state={{ from: location }} replace />;
    }

    return children;
}
