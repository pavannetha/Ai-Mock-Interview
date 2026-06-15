import React from "react";
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import ProtectedLayout from "./components/ProtectedLayout";
import AuthProtectedLayout from "./components/AuthProtectedLayout";
import FallBackLayout from "./components/FallBackLayout";
import Sidebar from "./components/Sidebar";
import NewInterview from "./pages/NewInterview";
import History from "./pages/History";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <>
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<ProtectedLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
            <Route element={<AuthProtectedLayout />}>
              <Route path="*" element={<FallBackLayout />} />
              <Route path="/" element={<Home />} />
              <Route path="/new-interview" element={<NewInterview />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

function Layout() {
  const location = useLocation();
  const isSidebarHidden =
    location.pathname === "/login" || location.pathname === "/signup";
  return (
    <div className="h-screen flex">
      {!isSidebarHidden && (
        <div className="border-1 w-44 fixed left-0 top-0 h-screen">
          <Sidebar />
        </div>
      )}

      <div
        className={`w-full overflow-y-auto ${!isSidebarHidden ? "ml-44" : ""}`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default App;
