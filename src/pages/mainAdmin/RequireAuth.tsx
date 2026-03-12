import { Navigate, useLocation } from "react-router-dom";
import { mainAdminStorage } from "./storage";

const RequireMainAdminAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  if (!mainAdminStorage.auth.isAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireMainAdminAuth;

