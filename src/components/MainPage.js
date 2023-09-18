import * as React from 'react';
import {useEffect} from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import TransactionStepper from './transactions/TransactionStepper'
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dashboard from "./overview/Dashboard";
import Report from "./reports/Report";
import LogoutIcon from '@mui/icons-material/Logout';
import {logout} from "../storage/firebase";
import {useNavigate} from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArticleIcon from '@mui/icons-material/Article';
import Typography from "@mui/material/Typography";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import piggy from '../icons/piggybank.png'

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        background: 'blue',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const getPageFromHash = function () {
    // Get the hash portion of the URL and remove the leading '#' character
    const hash = window.location.hash.slice(1);

// Split the hash into an array of key-value pairs
    const keyValuePairs = hash.split('&');

// Create an object to store the parsed key-value pairs
    const parsedData = {};

// Iterate through the key-value pairs and split each pair into a key and a value
    keyValuePairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        // Decode URI components to handle special characters
        parsedData[key] = decodeURIComponent(value);
    });

    return (parsedData['page'] && parseInt(parsedData['page']) ) || 0

}

const setPageInHash = function (page) {
    // Get the current hash
    const currentHash = window.location.hash.slice(1);

// Parse the current hash into an object
    const hashObject = currentHash
        ? currentHash.split('&').reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {})
        : {};

// Add or update key-value pairs
    hashObject.page = page;


// Convert the object back into a hash string
// Set the updated hash to window.location.hash
    window.location.hash = Object.entries(hashObject)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');

}

export default function MainPage({user}) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [page, setPage] = React.useState(getPageFromHash())
    const navigate = useNavigate();

    useEffect(() => {
        setPage(getPageFromHash())
    }, []);

    useEffect(() => {
        setPageInHash(page)
    }, [page]);

    const handleLogout = async () => {
        try {
            await logout()
        } catch (e) {
            throw e
        }
        navigate("/login");
    }

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function getContent(pageNum) {
        switch (pageNum) {
            case 0:
                return <Dashboard/>
            case 1:
                return <TransactionStepper/>
            case 2:
                return <Report/>
            default:
                throw new Error('Unknown page');
        }
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <img src={piggy} alt={'piggy'}/>
                    <div style={{ flex: 1 }} />
                    <Typography noWrap component="div">
                        {user}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <List>
                    <ListItem key='overview' disablePadding sx={{ display: 'block' }} onClick={() => {setPage(0)}}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                selected={page===0}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AssessmentIcon/>
                                </ListItemIcon>
                                <ListItemText primary='Overview' sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    <ListItem key='transactions' disablePadding sx={{ display: 'block' }} onClick={() => {setPage(1)}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={page===1}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <PointOfSaleIcon />
                            </ListItemIcon>
                            <ListItemText primary='Transactions' sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='reports' disablePadding sx={{ display: 'block' }} onClick={() => {setPage(2)}}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={page===2}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                <ArticleIcon />
                            </ListItemIcon>
                            <ListItemText primary='Reports' sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem key={'Logout'} disablePadding sx={{ display: 'block' }} onClick={handleLogout}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}
                            >
                                {<LogoutIcon/>}
                            </ListItemIcon>
                            <ListItemText primary='Logout' sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <DrawerHeader />
                {getContent(page)}
            </Box>
        </Box>
    );
}
