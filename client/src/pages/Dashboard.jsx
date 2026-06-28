import React, { lazy, Suspense } from "react";
import TechnicalScoreChart from "../components/TechnicalScoreChart";
import SkillsChart from "../components/SkillsChart";
import InterviewHistoryTable from "../components/InterviewHistoryTable";
export default function Dashboard() {
  return (
    <div className="h-screen flex flex-col justify-between">
      <div className="flex border-2 h-full">
        {/* charts */}
        <TechnicalScoreChart />
        <SkillsChart />
      </div>
      <div className="flex border-2 h-full">
        {/* table */}
        <InterviewHistoryTable />
      </div>
    </div>
  );
}
