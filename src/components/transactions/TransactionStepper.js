import * as React from 'react';
import {useContext} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TransactionForm from './TransactionForm';
import {Step, StepLabel, Stepper,} from "@mui/material";
import {persistTransactions} from "../../storage/store"
import {AppContext} from "../../context/AppContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../storage/firebase";
import {HistoryTable} from './HistoryTable'
import {generateRandomString} from '../../utils/utils'

const steps = ['Stock Transactions'];

export default function TransactionStepper() {
    const {model, setModel} = useContext(AppContext);
    const [summary, setSummary] = React.useState(false);
    const [user] = useAuthState(auth)

    const childRef = React.useRef(null);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Typography component="h1" variant="h4" align="center" style={{marginBottom: '12px'}}>
                        New Transaction
                    </Typography>
                    {summary ? (
                        <React.Fragment>
                            <Typography variant="h5" gutterBottom>
                                Transactions successfully saved.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    model.transactions = []
                                    setModel(model)
                                    if (childRef.current) {
                                        childRef.current.setReloadHistory(generateRandomString(8))
                                    }
                                    setSummary(false)
                                }}
                                sx={{mt: 3, ml: 1}}
                            >
                                Finish
                            </Button>
                        </React.Fragment>
                    ) :(
                        <TransactionForm
                            onFinish={async (transactions) => {
                                try {
                                    if (transactions.length > 0) {
                                        await persistTransactions(transactions, user)
                                    }
                                } catch (err) {
                                    throw err
                                }
                                model.transactions = transactions
                                setModel(model)
                                setSummary(true)
                            }}/>
                    )}

                </Paper>
            </Container>
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Typography component="h1" variant="h4" align="center" style={{marginBottom: '12px'}}>
                        Transaction History
                    </Typography>
                    <React.Fragment>
                        <HistoryTable user={user} forwardedRef={childRef}/>
                    </React.Fragment>
                </Paper>
            </Container>
        </React.Fragment>
    )

}

