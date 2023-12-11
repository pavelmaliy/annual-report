import React from 'react';
import { PieChart, Pie, Label, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#1976d2', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
            {`${name} ${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function MyPieChart({ transactions }) {

    const data = (function () {
        const data = []
        let stocks = {}
        transactions.map((item) => {
            let tr = item.data()
            if (!stocks[tr.stockName]) {
                stocks[tr.stockName] = {
                    "quantity": 0
                }
            }

            if (tr["transactionType"] === 'Purchase') {
                stocks[tr.stockName].quantity += tr.quantity
            } else {
                stocks[tr.stockName].quantity -= tr.quantity
            }

        })

        for (const stock in stocks) {
            if (stocks.hasOwnProperty(stock)) {
                data.push({
                    "name": stock.substring(0, 3),
                    "value": stocks[stock].quantity
                })
            }
        }

        return data
    })()

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                {data.map((entry, index) => (
                    <Label
                        key={`label-${index}`}
                        value={entry.name}
                        position="center"
                        fill="#8884d8"
                        style={{ fontSize: '16px' }}
                    />
                ))}
            </PieChart>
        </ResponsiveContainer>
    );
}