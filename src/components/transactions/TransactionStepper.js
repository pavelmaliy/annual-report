import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import TransactionForm from './TransactionForm';
import GeneralInfo from "./GeneralInfo";
import {Step, StepLabel, Stepper} from "@mui/material";
import {persistTransactions} from "../../storage/store"
import {useContext} from "react";
import {AppContext} from "../../context/AppContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../storage/firebase";

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const steps = ['General Info', 'Stock Transactions'];

export default function TransactionStepper({user}) {
    const {model, setModel} = useContext(AppContext);
    const [activeStep, setActiveStep] = React.useState(0);

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
                                New Transaction
                            </Button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {getStepContent(activeStep, model, setModel, setActiveStep)}
                        </React.Fragment>
                    )}
                </Paper>
                <Copyright/>
            </Container>
        </React.Fragment>
    );
}
