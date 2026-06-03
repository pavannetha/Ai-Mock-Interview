import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import ContextProvider from "./ContextProvider";

function AuthProtectedLayout() {
  if (!localStorage.getItem("user")) return <Navigate to="/login" replace />;
  return (
    <ContextProvider>
      <Outlet />
    </ContextProvider>
  );
}

export default AuthProtectedLayout;
