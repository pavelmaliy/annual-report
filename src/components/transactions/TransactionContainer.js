import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useContext } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { AppContext } from "../../context/AppContext";
import { auth } from "../../storage/firebase";
import { persistTransactions } from "../../storage/store";
import { generateRandomString } from '../../utils/utils';
import { HistoryTable } from './HistoryTable';
import TransactionForm from './TransactionForm';


export default function TransactionContainer() {
    const { model, setModel } = useContext(AppContext);
    const [user] = useAuthState(auth)

    const childRef = React.useRef(null);

    return (
        <React.Fragment>
            <CssBaseline />
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center" style={{ marginBottom: '12px' }}>
                        New Transaction
                    </Typography>

                    <TransactionForm
                        onFinish={async (transactions) => {
                            try {
                                if (transactions.length > 0) {
                                    await persistTransactions(transactions, user)
                                }
                            } catch (err) {
                                throw err
                            }
                            model.transactions = []
                            setModel(model)
                            if (childRef.current) {
                                childRef.current.setReloadHistory(generateRandomString(8))
                            }
                        }} />

                </Paper>
            </Container>
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                {/*  <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}> */}
                <Typography component="h1" variant="h4" align="center" style={{ marginBottom: '12px' }}>
                    Transaction History
                    </Typography>
                <React.Fragment>
                    <HistoryTable user={user} forwardedRef={childRef} />
                </React.Fragment>
                {/*  </Paper> */}
            </Container>
        </React.Fragment>
    )
}
