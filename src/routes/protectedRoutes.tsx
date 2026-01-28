import {type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (!loading && !user){ 
    return <Navigate to="/" replace />
  }

  if (loading || !user) {
    return null; // or <Loading />
  }

  return children;
};

export default ProtectedRoute;
