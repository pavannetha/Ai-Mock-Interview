import React from "react";
import { navitems } from "../utils/navitems";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }
  return (
    <div className="h-screen flex flex-col justify-between py-5 pl-2">
      <div>
        <header>
          <h1>AI-Mock-Interview</h1>
        </header>
        <nav className="mt-10">
          <ul>
            {navitems.map((item) => {
              return (
                <li key={item.path}>
                  <Link to={item.path}>{item.name}</Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div>
        <button className="cursor-pointer" onClick={logout}>
          LogOut
        </button>
      </div>
    </div>
  );
}
