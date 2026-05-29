import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import ProtectedLayout from "./components/ProtectedLayout";
import AuthProtectedLayout from "./components/AuthProtectedLayout";
import FallBackLayout from "./components/FallBackLayout";

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <div className="flex h-screen">
          <div className="w-32 border">sideBar</div>
          <div>
            <Routes>
              <Route element={<ProtectedLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>
              <Route element={<AuthProtectedLayout />}>
                <Route path="*" element={<FallBackLayout />} />
                <Route path="/" element={<Home />} />
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
App;
