import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts';

const chartSetting = {
    yAxis: [
        {
            label: 'sum',
        },
    ],
    width: 500,
    height: 300,
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'rotate(-90deg) translate(0px, -20px)',
        },
    },
};

const valueFormatter = (value) => `${value}€`;

export default function StockBarChart({ transactions }) {

    const getDataset = function () {

        if (transactions.length === 0) {
            return [
                {
                    "stock": "N/A",
                    "buy": 0,
                    "sell": 0
                }
            ]
        }

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
                datasetMap[tr.stockName]["buys"] += tr.quantity * tr.price
            } else {
                datasetMap[tr.stockName]["sells"] += tr.quantity * tr.price
            }
        })

        for (const stock in datasetMap) {
            if (datasetMap.hasOwnProperty(stock)) {
                dataset.push({
                    "stock": stock.substring(0, 3),
                    "buy": datasetMap[stock].buys,
                    "sell": datasetMap[stock].sells,                   
                })
            }
        }

        return dataset
    }


    return (
        <BarChart
            dataset={getDataset()}
            xAxis={[{ scaleType: 'band', dataKey: 'stock', barGapRatio: 0.1 }]}
            series={[
                { dataKey: 'buy', label: 'Buy', valueFormatter },
                { dataKey: 'sell', label: 'Sell', valueFormatter },               
            ]}
            {...chartSetting}
        />
    );
}
