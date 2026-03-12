import { Navigate, useLocation } from "react-router-dom";
import { baeAdminStorage } from "./storage";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  if (!baeAdminStorage.auth.isAuthed()) {
    return <Navigate to="/bae-admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;

