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
import { HistoryTable } from './HistoryTable';
import TransactionForm from './TransactionForm';
import { getUserTransactions, deleteTransaction, deleteAllTransactions } from "../../storage/store";
import { generateRandomString } from '../../utils/utils';


export default function TransactionContainer() {
    const { model, setModel } = useContext(AppContext);
    const [user] = useAuthState(auth)
    const [reloadHistory, setReloadHistory] = React.useState('')
    const [loading, setLoading] = React.useState(true);
    const [history, setHistory] = React.useState([])

    const handleDelete = async (id) => {
        if (id) {
            await deleteTransaction(id)
        } else {
            await deleteAllTransactions(user)
        }
        setReloadHistory(generateRandomString(8))
    }

    React.useEffect(() => {
        (async () => {
            let docs = await getUserTransactions(user)
            let newHistory = []
            docs.map((item) => {
                newHistory.push(item)
            })
            setHistory(newHistory)
            setLoading(false)
        })()
    }, [reloadHistory]);

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
                                    setReloadHistory(generateRandomString(8))
                                }
                            } catch (err) {
                                throw err
                            }
                            model.transactions = []
                            setModel(model)                           
                        }} />

                </Paper>
            </Container>
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>                
                <Typography component="h1" variant="h4" align="center" style={{ marginBottom: '12px' }}>
                    Transaction History
                    </Typography>
                <React.Fragment>
                    <HistoryTable history={[...history]} handleDelete={handleDelete} loading={loading} />
                </React.Fragment>                
                </Paper>
            </Container>
        </React.Fragment>
    )
}
