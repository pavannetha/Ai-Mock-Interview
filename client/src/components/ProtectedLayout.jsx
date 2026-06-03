import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedLayout() {
  const userDetails = localStorage.getItem("user");
  if (userDetails) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}

export default ProtectedLayout;
