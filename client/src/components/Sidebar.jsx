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
    <div className="h-screen flex flex-col justify-between py-5 p-2">
      <div>
        <header>
          <h1 className="p-2 rounded hover:shadow-lg font-serif text-amber-50 bg-gradient-to-r from-blue-600 to-indigo-700">
            AI-Mock-Interview
          </h1>
        </header>
        <nav className="mt-10">
          <ul>
            {navitems.map((item) => {
              return (
                <li className="mb-3" key={item.path}>
                  <Link
                    className="p-1 rounded hover:shadow-lg cursor-pointer font-serif text-black-500 bg-gradient-to-r from-blue-300 to-indigo-400"
                    to={item.path}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
      <div>
        <button
          className="p-2 cursor-pointer rounded hover:shadow-lg font-serif text-amber-50 bg-gradient-to-r from-blue-600 to-indigo-700"
          onClick={logout}
        >
          LogOut
        </button>
      </div>
    </div>
  );
}
