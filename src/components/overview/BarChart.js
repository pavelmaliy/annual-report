import * as React from 'react';
import {BarChart} from '@mui/x-charts/BarChart';
import {axisClasses} from '@mui/x-charts';

const chartSetting = {
    yAxis: [
        {
          label: 'total (k)',
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
const dataset = [
    {
        sell: 23,
        buy: 46,
        stock: 'SAP',
    },
    {
        sell: 18,
        buy: 62,
        stock: 'IBM',
    }
];

const valueFormatter = (value) => `${value*1000}€`;

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
