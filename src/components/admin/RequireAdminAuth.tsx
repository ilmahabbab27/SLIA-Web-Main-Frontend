import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from "@/lib/api";

const RequireAdminAuth = () => {
  const location = useLocation();
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || "{}") as { role?: string };
    } catch {
      return {};
    }
  })();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (user.role === "board_admin" && location.pathname !== "/admin/board-members") {
    return <Navigate to="/admin/board-members" replace />;
  }

  return <Outlet />;
};

export default RequireAdminAuth;
