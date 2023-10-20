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

export default function StockBarChart({transactions}) {   

    const getDataset = function() {
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
                    "sell": datasetMap[stock].sells,
                    "buy": datasetMap[stock].buys
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
                { dataKey: 'sell', label: 'Sell', valueFormatter },
                { dataKey: 'buy', label: 'Buy', valueFormatter },
            ]}
            {...chartSetting}
        />
    );
}
