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
        month: 'Jan',
    },
    {
        sell: 2000,
        buy: 4000,
        month: 'Feb',
    },
    {
        sell: 20000,
        buy: 40000,
        month: 'Mar',
    },
    {
        sell: 20300,
        buy: 43000,
        month: 'Apr',
    },
    {
        sell: 0,
        buy: 0,
        month: 'May',
    },
    {
        sell: 22300,
        buy: 46000,
        month: 'Jun',
    },
    {
        sell: 29300,
        buy: 43100,
        month: 'Jul',
    },
    {
        sell: 28300,
        buy: 46000,
        month: 'Aug',
    },
    {
        sell: 23300,
        buy: 44000,
        month: 'Sep',
    },
    {
        sell: 21300,
        buy: 41000,
        month: 'Oct',
    },
    {
        sell: 22300,
        buy: 42000,
        month: 'Nov',
    },
    {
        sell: 20300,
        buy: 43000,
        month: 'Dec',
    },
];

const valueFormatter = (value) => `${value}€`;

export default function StockBarChart() {
    return (
        <BarChart
            dataset={dataset}
            xAxis={[{scaleType: 'band', dataKey: 'month'}]}
            series={[
                {dataKey: 'sell', label: 'Sell', valueFormatter},
                {dataKey: 'buy', label: 'Buy', valueFormatter},                
            ]}
            {...chartSetting}
        />
    );
}
