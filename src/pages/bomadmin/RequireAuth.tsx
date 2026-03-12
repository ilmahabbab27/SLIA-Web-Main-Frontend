import { Navigate } from "react-router-dom";
import { bomAdminStorage } from "./storage";

export default function RequireBomAdminAuth({ children }: { children: React.ReactNode }) {
    if (!bomAdminStorage.auth.isAuthed()) {
        return <Navigate to="/bom-admin/login" replace />;
    }
    return <>{children}</>;
}
