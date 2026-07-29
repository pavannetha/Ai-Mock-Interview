import React from "react";
import TechnicalScoreChart from "../components/TechnicalScoreChart";
import SkillsChart from "../components/SkillsChart";
import InterviewHistoryTable from "../components/InterviewHistoryTable";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-semibold">Interview Dashboard</h1>
        <p className="mt-2 text-sm text-blue-100">
          Track your progress, review scores, and revisit past interview
          insights.
        </p>
      </div>

      <div className="mb-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <TechnicalScoreChart />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <SkillsChart />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <InterviewHistoryTable />
      </div>
    </div>
  );
}
