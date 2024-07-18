import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import * as React from 'react';
import StockBarChart from "./BarChart";
import MyLineChart from "./MyLineChart";
import MyPieChart from "./PieChart";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { getUserTransactions } from "../../storage/store";
import { auth } from "../../storage/firebase";
import LoadingScreen from "../common/LoadingScreen";
import YearSelector from "./YearSelector"

export default function Dashboard() {
    const [user] = useAuthState(auth)
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        (async () => {
            let docs = await getUserTransactions(user)
            setTransactions(docs)

            setLoading(false);
        })()
    }, []);


    return (
        <React.Fragment>
            <CssBaseline />
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
                        {loading ? (
                            <LoadingScreen />
                        ) : (
                            <>
                                <StockBarChart transactions={transactions} />
                            </>
                        )}
                    </Box>
                </Paper>
            </Container>
        </React.Fragment>
    );
}
