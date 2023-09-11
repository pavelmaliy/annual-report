import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TransactionStepper from "./components/transactions/TransactionStepper";
import {Tabs} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Dashboard from "./components/Dashboard";

export default function LabTabs() {
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%', typography: 'body1'}}>
            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <AppBar position="static">
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            indicatorColor="secondary"
                            textColor="inherit"
                            centered
                            variant="standard"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Overview" value="1"/>
                            <Tab label="Transactions" value="2"/>
                            <Tab label="Report" value="3"/>
                        </Tabs>
                    </AppBar>
                </Box>
                <TabPanel value="1">
                    <Dashboard/>
                </TabPanel>
                <TabPanel value="2">
                    <TransactionStepper/>
                </TabPanel>
                <TabPanel value="3">Report</TabPanel>
            </TabContext>
        </Box>
    );
}
