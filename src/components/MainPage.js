import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabPanel from '@mui/lab/TabPanel';
import TransactionStepper from "./transactions/TransactionStepper";
import {Menu, MenuItem, Tabs} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Dashboard from "./overview/Dashboard";
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import {logout} from "../storage/firebase";
import {useNavigate} from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import {useEffect} from "react";

export default function MainPage({user}) {
    const [tab, setTab] = React.useState(localStorage.getItem('lastActiveTab') || '1');
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    useEffect(() => {
        const storedValue = localStorage.getItem('lastActiveTab');
        if (storedValue) {
            setTab(storedValue)
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('lastActiveTab', tab);
    }, [tab]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = async (option) => {
        setAnchorEl(null);
        if (option === 'logout') {
            try {
                await logout()
            } catch (e) {
                throw e
            }
            navigate("/login");
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Box sx={{width: '100%', typography: 'body1'}}>
            <TabContext value={tab}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <AppBar position="static">
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                onClick={handleMenuOpen}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" style={{ flexGrow: 1 }}>
                                {user}
                            </Typography>
                        </Toolbar>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={()=> {handleMenuClose("logout")}}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
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
