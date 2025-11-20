import { ReactNode } from "react";
import { useUser } from "@stackframe/react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute component that redirects to sign-in if user is not authenticated
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const user = useUser();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

