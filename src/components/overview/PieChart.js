import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { getSectionsBoundaries } from '@mui/x-date-pickers/internals/hooks/useField/useField.utils';

export default function StockPieChart({ transactions }) {

    const getData = function () {

        if (transactions.length === 0) {
            return [
                {
                    arcLabel: (item) => `${item.label}`,
                    data: [{
                        "id": 0,
                        "value": 0,
                        "label": "N/A"
                    }],
                },
            ]
        }

        let series = []
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

        let id = 0
        for (let stock in stocks) {
            if (stocks.hasOwnProperty(stock)) {
                series.push({
                    "id": id,
                    "value": stocks[stock].quantity,
                    "label": stock
                })
                id += 1
            }
        }

        return [
            {
                arcLabel: (item) => `${item.label}`,
                data: series,
            },
        ]
    }

    return (
        <PieChart
            series={getData()}
            width={400}
            height={200}
        />
    );
}
