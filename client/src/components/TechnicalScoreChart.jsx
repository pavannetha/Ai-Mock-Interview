import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "../apis/interceptors";

function TechnicalScoreChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        const response = await api.get("/interview/history");
        const interviews = response?.data?.interviews || [];

        const chartData = interviews.map((interview, index) => ({
          interview: `Interview ${index + 1}`,
          technicalScore: interview.technicalScore ?? 0,
          date: interview.startedAt
            ? new Date(interview.startedAt).toLocaleDateString()
            : "N/A",
        }));

        setData(chartData);
      } catch (error) {
        console.error("Failed to load interview history", error);
      }
    };

    fetchInterviewHistory();
  }, []);

  return (
    <div className="p-8">
      {/* <ResponsiveContainer width="100%" aspect={1.618} maxHeight={400}> */}

      <LineChart
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "100%",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis dataKey="date" />

        <YAxis width="auto" domain={[0, 10]} />

        <Tooltip formatter={(value) => [`${value}/10`]} />
        <Legend />
        <Line
          type="monotone"
          dataKey="technicalScore"
          // stroke="var(--color-chart-1)"
          // dot={{
          //     fill: 'var(--color-surface-base)',
          // }}
          activeDot={{ r: 5 }}
        />

        {/* <RechartsDevtools /> */}
      </LineChart>

      {/* </ResponsiveContainer> */}
    </div>
  );
}

/*
Go through docs

aspectRatio (Linechart component)

Change Leged component title, without effecting y-axis

*/

export default TechnicalScoreChart;
