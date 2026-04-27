import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

const RequireAdmin = ({ children }: { children: ReactNode }) => {
  const user = useAuth((s) => s.user);
  const location = useLocation();

  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
};

export default RequireAdmin;