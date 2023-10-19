import * as React from 'react';
import {PieChart} from '@mui/x-charts/PieChart';

export default function StockPieChart() {

    return (
        <PieChart        
            series={[
                {
                    arcLabel: (item) => `${item.value}%`,
                    data: [
                        {id: 0, value: 100, label: 'SAP SE'},
                    ],
                },
            ]}
            width={400}
            height={200}
        />
    );
}
