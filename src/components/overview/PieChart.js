import * as React from 'react';
import {PieChart} from '@mui/x-charts/PieChart';

export default function StockPieChart() {

    return (
        <PieChart        
            series={[
                {
                    arcLabel: (item) => `${item.value}%`,
                    data: [
                        {id: 0, value: 50, label: 'SAP SE'},
                        {id: 1, value: 50, label: 'IBM'},
                    ],
                },
            ]}
            width={400}
            height={200}
        />
    );
}
