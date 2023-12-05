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


export default function MyLineChart({ transactions, year}) {

  const getDataset = function () {
    const monthOptionsShort = { month: 'short' };
    const data = {}
    const dataSet = []

    transactions.forEach(item => {
      let transaction = item.data()
      const trDate = transaction.transactionDate.toDate();
      const monthName = trDate.toLocaleString('en-US', monthOptionsShort);
      const month = trDate.getMonth();

      if (transaction["transactionType"] === 'Sell' || trDate.getFullYear() != year) {
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
      <XAxis dataKey="name" label={{ value: 'Purchases', position: 'down' }} />
      <YAxis />
      <Tooltip />
      <Legend />
      {/* {["SAP", "IBM"].map((stock) => (
            <Line
              type="monotone"
              dataKey={stock}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color
            />
          ))} */}
       <Line type="monotone" dataKey="SAP" stroke="green" />
       <Line type="monotone" dataKey="IBM" stroke="blue" />    
    </LineChart>
  );
}
