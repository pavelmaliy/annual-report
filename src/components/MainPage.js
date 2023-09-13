import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TransactionStepper from "./transactions/TransactionStepper";
import {Tabs} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Dashboard from "./overview/Dashboard";
import Typography from '@mui/material/Typography';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import IconButton from '@mui/material/IconButton';
import {Stack} from "@mui/system";
import {logout} from "../storage/firebase";
import {useNavigate} from "react-router-dom";

export default function MainPage({user}) {
    const [tab, setTab] = React.useState('1');
    const navigate = useNavigate();
    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    const handleLogout = async () => {
        try {
            await logout()
        } catch (e) {
            throw e
        }
        navigate("/login");
    }

    return (
        <Box sx={{width: '100%', typography: 'body1'}}>
            <TabContext value={tab}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <AppBar position="static">
                        <Box pt={1} pr={2}>
                            <Stack direction="column" alignItems="flex-end">
                                <Typography sx={{ mb: -1, cursor: 'default'  }}>{user}</Typography>
                                <IconButton color="inherit" onClick={handleLogout}>
                                    <ExitToAppIcon />
                                </IconButton>
                            </Stack>
                        </Box>
                        <Tabs
                            value={tab}
                            onChange={handleTabChange}
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
