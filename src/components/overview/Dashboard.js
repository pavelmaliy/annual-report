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
    const [year, setYear] = React.useState(new Date().getFullYear());
    const [yearTransactions, setYearTransactions] = React.useState([]);

    useEffect(() => {
        (async () => {
            const filteredTransactions = []
            let docs = await getUserTransactions(user)
            setTransactions(docs)
            for (const tr of docs) {
                if (tr.data().transactionDate.toDate().getFullYear() == year) {
                    filteredTransactions.push(tr)
                }
            }
            setYearTransactions(filteredTransactions)
            setLoading(false);
        })()
    }, []);

    const applyYear = (year) => {
        const result = []
        setYear(year)
        for (const tr of transactions) {
            if (tr.data().transactionDate.toDate().getFullYear() == year) {
                result.push(tr)
            }
        }
        setYearTransactions(result)
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>            
                <Box display="flex" flexDirection="row" alignItems="center">
                    {loading ? (
                        <LoadingScreen />
                    ) : (
                            <>
                                <Grid container spacing={2}>
                                    {/* First Row: YearSelector in the center */}
                                    <Grid item xs={12}>
                                        <Grid container justifyContent="center">
                                            <YearSelector onYearChangeCallback={applyYear} />
                                        </Grid>
                                    </Grid>

                                    {/* Second Row: Two components */}
                                    <Grid item xs={6}>
                                        <MyLineChart transactions={yearTransactions} isPurchases={true} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <StockBarChart transactions={yearTransactions} />
                                    </Grid>

                                    {/* Third Row: Two components */}
                                    <Grid item xs={6}>
                                        <MyLineChart transactions={yearTransactions} isPurchases={false} />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <MyPieChart transactions={yearTransactions}/>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                </Box>
                </Paper>
            </Container>
        </React.Fragment>
    );
}
