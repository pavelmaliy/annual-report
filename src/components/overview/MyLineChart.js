import React from "react";
import {
  Text,
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
    IBM: 2400
  },
  {
    name: "Feb",
    SAP: 3000,
    IBM: 1398
  },
  {
    name: "Mar",
    SAP: 2000,
    IBM: 9800
  },
  {
    name: "Apr",
    SAP: 2780,
    IBM: 3908
  },
  {
    name: "May",
    SAP: 1890,
    IBM: 4800
  },
  {
    name: "Jun",
    SAP: 2390,
    IBM: 3800
  },
  {
    name: "Jul",
    SAP: 3490,
    IBM: 4300
  },
  {
    name: "Aug",
    SAP: 3490,
    IBM: 4300
  },
  {
    name: "Sep",
    SAP: 3490,
    IBM: 4300
  },
  {
    name: "Oct",
    SAP: 3490,
    IBM: 4300
  },
  {
    name: "Nov",
    SAP: 6100,
    IBM: 7000
  },
  {
    name: "Dec",
    SAP: 3490,
    IBM: 4300
  }
];


export default function MyLineChart({ transactions }) {


  const getDataset = function () {
    const monthOptionsShort = { month: 'short' };
    const currentYear = new Date().getFullYear();
    const data = {}
    const dataSet = []

    transactions.forEach(item => {
      let transaction = item.data()
      const trDate = transaction.transactionDate.toDate();
      const monthName = trDate.toLocaleString('en-US', monthOptionsShort);
      const month = trDate.getMonth();

      if (transaction["transactionType"] === 'Sell' || trDate.getFullYear() != currentYear) {
        return
      }

      const stockName = transaction.stockName.substring(0, 3)
      if (!data[month]) {
        let entry = {}
        entry["name"] = monthName
        entry[stockName] = transaction.quantity * transaction.price
        data[month] = entry
      } else {
        if (data[month][stockName]) {
          data[month][stockName] += transaction.quantity * transaction.price
        } else {
          data[month][stockName] = transaction.quantity * transaction.price
        }
      }
    });

    const sortedKeys = Object.keys(data).sort((a, b) => a - b);

    sortedKeys.forEach(key => {
      dataSet.push(data[key])
    });

    return dataSet

  }


  return (
    <LineChart
      width={500}
      height={300}
      data={getDataset()}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" label={{ value: 'Purchases', position: 'top' }} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="SAP" stroke="green" />
      <Line type="monotone" dataKey="IBM" stroke="blue" />
    </LineChart>
  );
}
