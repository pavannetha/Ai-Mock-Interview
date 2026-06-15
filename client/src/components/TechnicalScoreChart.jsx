import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function TechnicalScoreChart() {
  const data = [
    {
      interview: `Interview 1`,
      technicalScore: 3,
      date: "3 june",
    },

    {
      interview: `Interview 2`,
      technicalScore: 5,
      date: "5 june",
    },
    {
      interview: `Interview 3`,
      technicalScore: 6.5,
      date: "8 june",
    },
    {
      interview: `Interview 4`,
      technicalScore: 7,
      date: "10 june",
    },
    {
      interview: `Interview 5`,
      technicalScore: 9,
      date: "13 june", // 14 June
    },
  ];
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
