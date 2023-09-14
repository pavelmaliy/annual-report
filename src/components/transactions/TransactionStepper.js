import * as React from 'react';
import {useContext} from 'react';
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
    Stepper, TableCell, TableHead, TableRow, TableContainer, Table, TableBody
} from "@mui/material";
import {persistTransactions} from "../../storage/store"
import {AppContext} from "../../context/AppContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../storage/firebase";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const steps = ['General Info', 'Stock Transactions'];
const tableContainerStyle = {
    maxHeight: '300px', // Set the maximum height for vertical scrolling
    overflowY: 'auto',   // Enable vertical scroll
};

export default function TransactionStepper() {
    const {model, setModel} = useContext(AppContext);
    const [activeStep, setActiveStep] = React.useState(0);
    const [user] = useAuthState(auth)

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

    return (
        <React.Fragment>
            <CssBaseline/>
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
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Typography component="h1" variant="h4" align="center">
                        Transaction History
                    </Typography>
                    <React.Fragment>
                        <div style={tableContainerStyle}>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: 'bold' }}>Date</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Stock</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
                                        <TableCell style={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Typography>
                                                15/10/2022
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                SAP
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                Sell
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                22
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography>
                                                15/10/2022
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                SAP
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                Sell
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                22
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography>
                                                15/10/2022
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                SAP
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                Sell
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                22
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography>
                                                15/10/2022
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                SAP
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                Sell
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                22
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>
                                            <Typography>
                                                15/10/2022
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                SAP
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                Sell
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography>
                                                22
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                        </div>
                    </React.Fragment>
                </Paper>
            </Container>
        </React.Fragment>
    );
}
