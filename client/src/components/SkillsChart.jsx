import { useEffect, useState } from "react";
import { Pie, PieChart, Sector } from "recharts";
import { api } from "../apis/interceptors";
// import { RechartsDevtools } from '@recharts/devtools';

const RADIAN = Math.PI / 180;
const COLORS = ["#ff471a", "green"];

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) {
    return null;
  }

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const ncx = Number(cx);
  const x = ncx + radius * Math.cos(-(midAngle ?? 0) * RADIAN);
  const ncy = Number(cy);
  const y = ncy + radius * Math.sin(-(midAngle ?? 0) * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > ncx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${((percent ?? 1) * 100).toFixed(0)}%`}
    </text>
  );
};

const MyCustomPie = (props) => {
  return <Sector {...props} fill={COLORS[props.index % COLORS.length]} />;
};

export default function SkillsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInterviewHistory = async () => {
      try {
        const response = await api.get("/interview/history");
        const interviews = response?.data?.interviews || [];

        const skillData = interviews.reduce((acc, interview) => {
          const strongAreas = interview.strongAreas || [];
          const weakAreas = interview.weakAreas || [];

          strongAreas.forEach((skill) => {
            const existing = acc.find((item) => item.name === skill);
            if (existing) {
              existing.value += 1;
            } else {
              acc.push({ name: skill, value: 1 });
            }
          });

          weakAreas.forEach((skill) => {
            const existing = acc.find((item) => item.name === skill);
            if (existing) {
              existing.value += 1;
            } else {
              acc.push({ name: skill, value: 1 });
            }
          });

          return acc;
        }, []);

        setData(skillData.length ? skillData : [{ name: "No data", value: 1 }]);
      } catch (error) {
        console.error("Failed to load skills chart", error);
      }
    };

    fetchInterviewHistory();
  }, []);

  return (
    <PieChart
      style={{
        width: "100%",
        maxWidth: "30vw",
        height: "100%",
        maxHeight: "80vh",
        aspectRatio: 1,
      }}
      responsive
    >
      <Pie
        data={data}
        labelLine={false}
        label={renderCustomizedLabel}
        fill="#8884d8"
        dataKey="value"
        isAnimationActive={true}
        shape={MyCustomPie}
      />
      {/* <RechartsDevtools /> */}
    </PieChart>
  );
}
