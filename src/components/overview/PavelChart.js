import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

const data = [
  {
    name: "Jan",
    SAP: 4000,
    IBM: 2400,
    amt: 2400
  },
  {
    name: "Feb",
    SAP: 3000,
    IBM: 1398,
    amt: 2210
  },
  {
    name: "Mar",
    SAP: 2000,
    IBM: 9800,
    amt: 2290
  },
  {
    name: "Apr",
    SAP: 2780,
    IBM: 3908,
    amt: 2000
  },
  {
    name: "May",
    SAP: 1890,
    IBM: 4800,
    amt: 2181
  },
  {
    name: "Jun",
    SAP: 2390,
    IBM: 3800,
    amt: 2500
  },
  {
    name: "Jul",
    SAP: 3490,
    IBM: 4300,
    amt: 2100
  },
  {
    name: "Aug",
    SAP: 3490,
    IBM: 4300,
    amt: 2100
  },
  {
    name: "Sep",
    SAP: 3490,
    IBM: 4300,
    amt: 2100
  },
  {
    name: "Oct",
    SAP: 3490,
    IBM: 4300,
    amt: 2100
  },
  {
    name: "Nov",
    SAP: 6100,
    IBM: 7000,
    amt: 2100
  },
  {
    name: "Dec",
    SAP: 3490,
    IBM: 4300,
    amt: 2100
  }
];

export default function Pavel() {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="SAP"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="IBM" stroke="#82ca9d" />
    </LineChart>
  );
}
