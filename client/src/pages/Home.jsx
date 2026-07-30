import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../components/ContextProvider";

export default function Home() {
  const { userDetails } = useContext(UserProvider);
  const navigate = useNavigate();

  const cards = [
    {
      title: "New Interview",
      description: "Start a fresh mock interview session.",
      path: "/new-interview",
    },
    {
      title: "Interview History",
      description: "Review previous interview results.",
      path: "/history",
    },
    {
      title: "Profile",
      description: "Update your personal details.",
      path: "/profile",
    },
    {
      title: "Dashboard",
      description: "See your performance at a glance.",
      path: "/dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-semibold">
            Welcome back, {userDetails.name || "Candidate"}!
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-100">
            Use the buttons below to navigate to your interview dashboard, view
            your history, update profile information, or begin a new mock
            interview.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {cards.map((card) => (
            <button
              key={card.path}
              onClick={() => navigate(card.path)}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">
                  {card.title}
                </h2>
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                  Go
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-600">{card.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                Navigate <span className="text-lg">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
