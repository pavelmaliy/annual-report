import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import StockBarChart from "./BarChart";
import StockPieChart from "./PieChart";
import Copyright from '../common/Copyright'

export default function Dashboard() {

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <StockPieChart/>
                        <StockBarChart/>
                    </Box>
                </Paper>
                <Copyright/>
            </Container>
        </React.Fragment>
    );
}
