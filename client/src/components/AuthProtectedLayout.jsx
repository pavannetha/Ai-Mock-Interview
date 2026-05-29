import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function AuthProtectedLayout() {
  if (!localStorage.getItem("user")) return <Navigate to="/login" />;
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthProtectedLayout;
