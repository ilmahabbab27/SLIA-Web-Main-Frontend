import { Navigate, useLocation } from "react-router-dom";
import { bapAdminStorage } from "./storage";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  if (!bapAdminStorage.auth.isAuthed()) {
    return <Navigate to="/bap-admin/login" replace state={{ from: location.pathname }} />;
  }
  return <>{children}</>;
};

export default RequireAuth;

