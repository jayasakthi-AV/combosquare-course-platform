// src/components/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { isLoggedIn, getUser } from "../services/api";

export default function AdminRoute({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}