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


export default function MyLineChart({ transactions, isPurchases }) {

  const uniqueStocks = {}
  const colors = ["#00C49F", "#1976d2", "red", "purple", "yellow"]
  const getDataset = function () {
    const monthOptionsShort = { month: 'short' };
    const data = {}
    const dataSet = []

    transactions.forEach(item => {
      let transaction = item.data()
      const trDate = transaction.transactionDate.toDate();
      const monthName = trDate.toLocaleString('en-US', monthOptionsShort);
      const month = trDate.getMonth();
     
      
      if (transaction["transactionType"] === (isPurchases ? 'Sell' : 'Purchase') ) {
        return
      }

      const stockName = transaction.stockName.substring(0, 3)
      uniqueStocks[stockName] = 1
      if (!data[month]) {
        let entry = {}
        entry["name"] = monthName
        entry[stockName] = transaction.originalQuantity * transaction.price
        data[month] = entry
      } else {
        if (data[month][stockName]) {
          data[month][stockName] += transaction.originalQuantity * transaction.price
        } else {
          data[month][stockName] = transaction.originalQuantity * transaction.price
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
      <XAxis dataKey="name" label={{ value: isPurchases ? 'Purchases' : 'Sells', position: 'top' }} />
      <YAxis />
      <Tooltip />
      <Legend />
      {Object.keys(uniqueStocks).map((stock, index) => {
        const color = index < 5 ? colors[index] : `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        return (
          <Line
            key={index}
            type="monotone"
            dataKey={stock}
            stroke={color}
          />
        );
      })}
    </LineChart>
  );
}
