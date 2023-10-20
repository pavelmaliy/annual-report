import * as React from 'react';
import {BarChart} from '@mui/x-charts/BarChart';
import {axisClasses} from '@mui/x-charts';

const chartSetting = {
    width: 500,
    height: 300,
    sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'rotate(-90deg) translate(0px, -20px)',
        },
    },
};
const dataset = [
    {
        sell: 23000,
        buy: 46000,
        stock: 'SAP',
    },
    {
        sell: 18000,
        buy: 62000,
        stock: 'IBM',
    }
];

const valueFormatter = (value) => `${value}€`;

export default function StockBarChart() {
    return (
        <BarChart
            dataset={dataset}
            xAxis={[{scaleType: 'band', dataKey: 'stock'}]}
            series={[
                {dataKey: 'sell', label: 'Sell', valueFormatter},
                {dataKey: 'buy', label: 'Buy', valueFormatter},                
            ]}
            {...chartSetting}
        />
    );
}
