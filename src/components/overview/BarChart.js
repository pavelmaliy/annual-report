import * as React from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function StockBarChart({ transactions }) {

    const getDataset = function () {
        let dataset = []
        let datasetMap = {}

        transactions.map((item) => {
            let tr = item.data()


            if (!datasetMap[tr.stockName]) {
                datasetMap[tr.stockName] = {
                    "sells": 0,
                    "buys": 0,
                }
            }

            if (tr["transactionType"] === 'Purchase') {
                datasetMap[tr.stockName]["buys"] += tr.originalQuantity * tr.price
            } else {
                datasetMap[tr.stockName]["sells"] += tr.originalQuantity * tr.price
            }
        })

        for (const stock in datasetMap) {
            if (datasetMap.hasOwnProperty(stock)) {
                dataset.push({
                    "name": stock.substring(0, 3),
                    "buy": datasetMap[stock].buys,
                    "sell": datasetMap[stock].sells,
                })
            }
        }

        return dataset
    }


    return (
        <>
            <BarChart
                width={500}
                height={300}
                data={getDataset()}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" label={{ value: 'Total', position: 'left' }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="buy" fill="#1976d2" activeBar={<Rectangle fill="pink" stroke="#1976d2" />} />
                <Bar dataKey="sell" fill="#00C49F" activeBar={<Rectangle fill="gold" stroke="purple" />} />
            </BarChart>
        </>
    );
}
