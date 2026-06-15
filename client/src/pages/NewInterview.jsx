import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function NewInterview() {
  const data = [
    {
      name: "A",
      uv: 400,
      pv: 240,
      amt: 2400,
    },
    {
      name: "B",
      uv: 300,
      pv: 456,
      amt: 2400,
    },
    {
      name: "C",
      uv: 300,
      pv: 139,
      amt: 2400,
    },
    {
      name: "D",
      uv: 200,
      pv: 980,
      amt: 2400,
    },
    {
      name: "E",
      uv: 278,
      pv: 390,
      amt: 2400,
    },
    {
      name: "F",
      uv: 189,
      pv: 480,
      amt: 2400,
    },
  ];
  return (
    <div>
      <LineChart width={500} height={300} data={data} accessibilityLayer>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line type="monotone" dataKey="uv" stroke="#8884d8" />
        <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
        <Tooltip />
      </LineChart>
      hhi
    </div>
  );
}
