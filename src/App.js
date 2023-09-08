import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Checkout from "./components/Checkout";

export default function LabTabs() {
    const [value, setValue] = React.useState('1');
    const [model, setModel] = React.useState({});

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
                        <Tab label="Home" value="1" />
                        <Tab label="Transactions" value="2" />
                        <Tab label="Report" value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1">Home</TabPanel>
                <TabPanel value="2">
                    <Checkout model={model} setModel={setModel}/>
                </TabPanel>
                <TabPanel value="3">Report</TabPanel>
            </TabContext>
        </Box>
    );
}
