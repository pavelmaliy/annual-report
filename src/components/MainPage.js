import * as React from 'react';
import { useContext, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import TransactionContainer from './transactions/TransactionContainer'
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
import EuroIcon from '@mui/icons-material/Euro';
import DollarIcon from '@mui/icons-material/AttachMoney';
import { ReactComponent as ShekelIcon } from '../icons/shekel.svg';
import { logout } from "../storage/firebase";
import { useNavigate } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArticleIcon from '@mui/icons-material/Article';
import Typography from "@mui/material/Typography";
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { getPageFromHash, setPageInHash } from "../utils/utils"
import { Menu, MenuItem } from "@mui/material";
import currencies from "../resources/commonCurrency.json";
import { AppContext } from "../context/AppContext";
import LightTooltip from "./common/LightTooltip"
import LaptopIcon from '@mui/icons-material/Laptop';

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

export default function MainPage({ user }) {
    const { model, setModel } = useContext(AppContext);
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [page, setPage] = React.useState(getPageFromHash())
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [logoutAnchorEl, setLogoutAnchorEl] = React.useState(null);
    const [currencyIcon, setCurrencyIcon] = React.useState(<ShekelIcon />)

    const navigate = useNavigate();

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
                return <Dashboard />
            case 1:
                return <TransactionContainer />
            case 2:
                return <Report />
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
                    <LaptopIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            BSMART
          </Typography>
                    <div style={{ flex: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap component="div"
                        style={{ cursor: 'pointer' }}
                        onClick={(event) => { setLogoutAnchorEl(event.currentTarget) }}
                    >
                        {user}
                    </Typography>
                    <Menu
                        anchorEl={logoutAnchorEl}
                        open={Boolean(logoutAnchorEl)}
                        onClose={() => { setLogoutAnchorEl(null) }}
                    >
                        <MenuItem onClick={handleLogout}>
                            <LogoutIcon style={{ marginRight: '8px' }} />
                                Logout
                            </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <List>
                    <ListItem key='overview' disablePadding sx={{ display: 'block' }} onClick={() => { setPage(0) }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={page === 0}
                        >
                            <LightTooltip title="Overview">
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AssessmentIcon />
                                </ListItemIcon>
                            </LightTooltip>
                            <ListItemText primary='Overview' sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='transactions' disablePadding sx={{ display: 'block' }} onClick={() => { setPage(1) }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={page === 1}
                        >
                            <LightTooltip title="Transactions">
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <CurrencyExchangeIcon />
                                </ListItemIcon>
                            </LightTooltip>
                            <ListItemText primary='Transactions' sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key='reports' disablePadding sx={{ display: 'block' }} onClick={() => { setPage(2) }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            selected={page === 2}
                        >
                            <LightTooltip title="Reports">
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <ArticleIcon />
                                </ListItemIcon>
                            </LightTooltip>
                            <ListItemText primary='Reports' sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider sx={{ borderBottomWidth: 2 }} />
                <List>
                    <ListItem key={'Currency'} disablePadding sx={{ display: 'block' }} onClick={(event) => { setAnchorEl(event.currentTarget); }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <LightTooltip title="Local Currency">
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {currencyIcon}
                                </ListItemIcon>
                            </LightTooltip>
                            <ListItemText primary='Currency' sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClick={(event) => {
                            let curr = event.target.outerText
                            model.localCurrency = curr
                            setModel(model)
                            if (curr === 'USD') {
                                setCurrencyIcon(<DollarIcon />)
                            } else if (curr === 'EUR') {
                                setCurrencyIcon(<EuroIcon />)
                            } else if (curr === 'ILS') {
                                setCurrencyIcon(<ShekelIcon />)
                            }
                        }}
                        onClose={() => { setAnchorEl(null) }}
                    >
                        {Object.keys({ "ILS": {} }).map((currency) => (
                            <MenuItem itemID={currency} key={currency} value={currency} onClick={() => { setAnchorEl(null) }}>
                                {currency}
                            </MenuItem>
                        ))}
                    </Menu>
                    <ListItem key={'Logout'} disablePadding sx={{ display: 'block' }} onClick={handleLogout}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                        >
                            <LightTooltip title="Logout">
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {<LogoutIcon />}
                                </ListItemIcon>
                            </LightTooltip>
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
