import React, { useEffect, useState } from "react";
import { api } from "../apis/interceptors";

export default function InterviewHistoryTable() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await api.get("/interview/history");
        setInterviews(response?.data?.interviews || []);
      } catch (error) {
        console.error("Failed to load interview history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  if (loading) {
    return <div className="p-4">Loading interview history...</div>;
  }

  return (
    <div className="w-full p-4">
      <h2 className="mb-4 text-xl font-semibold">Interview History</h2>
      {interviews.length === 0 ? (
        <p className="text-gray-600">No interview history yet.</p>
      ) : (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">#</th>
                <th className="px-3 py-2 text-left">Stack</th>
                <th className="px-3 py-2 text-left">Difficulty</th>
                <th className="px-3 py-2 text-left">Score</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Feedback</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview, index) => (
                <tr key={interview._id} className="border-t">
                  <td className="px-3 py-2">{index + 1}</td>
                  <td className="px-3 py-2">{interview.stack || "N/A"}</td>
                  <td className="px-3 py-2">
                    {interview.difficultyLevel || "N/A"}
                  </td>
                  <td className="px-3 py-2">
                    {interview.technicalScore ?? "N/A"}
                  </td>
                  <td className="px-3 py-2">
                    {interview.startedAt
                      ? new Date(interview.startedAt).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="px-3 py-2">
                    {interview.feedback || "No feedback"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
