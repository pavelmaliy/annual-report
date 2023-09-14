import * as React from 'react';
import {useContext, useEffect} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TransactionForm from './TransactionForm';
import GeneralInfo from "./GeneralInfo";
import {
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {persistTransactions} from "../../storage/store"
import {AppContext} from "../../context/AppContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../../storage/firebase";
import {collection, getDocs, query, where} from "firebase/firestore";

const steps = ['General Info', 'Stock Transactions'];
const tableContainerStyle = {
    maxHeight: '300px', // Set the maximum height for vertical scrolling
    overflowY: 'auto',   // Enable vertical scroll
};

const tableHeaderStyle = {
    position: 'sticky',
    top: 0,
    background: 'white',
    zIndex: 1,
};

export default function TransactionStepper() {
    const {model, setModel} = useContext(AppContext);
    const [activeStep, setActiveStep] = React.useState(0);
    const [user] = useAuthState(auth)
    const [history, setHistory] = React.useState([])
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
        (async () => {
            const q = query(collection(db, "transactions"), where("user_id", "==", user.uid));
            try {
                const docs = await getDocs(q);
                docs.docs.map((item) => {
                    history.push(item.data())
                })
            } catch (e) {
                console.error(e)
            }
            setHistory(history)
            setLoading(false);
        })()
    }, []);

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <GeneralInfo onFinish={(props) => {
                    model.currency = props.currency
                    model.exchange = props.exchange
                    setModel(model)
                    setActiveStep(1)
                }}/>
            case 1:
                return <TransactionForm
                    onBack={(transactions) => {
                        setActiveStep(0)
                        model.transactions = transactions
                        setModel(model)
                    }}
                    onFinish={async (transactions) => {
                        try {
                            await persistTransactions(transactions, user)
                        } catch (err) {
                            throw err
                        }
                        model.transactions = transactions
                        setModel(model)
                        setActiveStep(2)

                    }}/>;
            default:
                throw new Error('Unknown step');
        }
    }

    function NewTransaction() {
        return (
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Typography component="h1" variant="h4" align="center">
                        New Transaction
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography variant="h5" gutterBottom>
                                Transactions successfully saved.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    model.transactions = []
                                    model.currency = ''
                                    model.exchange = ''
                                    setModel(model)
                                    setActiveStep(0);
                                }}
                                sx={{mt: 3, ml: 1}}
                            >
                                Finish
                            </Button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {getStepContent(activeStep, model, setModel, setActiveStep)}
                        </React.Fragment>
                    )}
                </Paper>
            </Container>
        );
    }

    return (
        <div>
            {(loading) ? (
                <React.Fragment>
                    <CssBaseline/>
                    <NewTransaction/>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <CssBaseline/>
                    <NewTransaction/>
                    <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                            <Typography component="h1" variant="h4" align="center" style={{marginBottom: '12px'}}>
                                Transaction History
                            </Typography>
                            <React.Fragment>
                                <TableContainer component={Paper} style={tableContainerStyle}>
                                    <Table>
                                        <TableHead style={tableHeaderStyle}>
                                            <TableRow>
                                                <TableCell>
                                                    <Typography style={{fontWeight: 'bold'}}>
                                                        Date
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography style={{fontWeight: 'bold'}}>
                                                        Stock
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography style={{fontWeight: 'bold'}}>
                                                        Action
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography style={{fontWeight: 'bold'}}>
                                                        Quantity
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {history.map((item, index) => (
                                                <TableRow>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.transactionDate}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.stockName}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.transactionType}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.quantity}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </React.Fragment>
                        </Paper>
                    </Container>
                </React.Fragment>
            )}
        </div>
    );
}

