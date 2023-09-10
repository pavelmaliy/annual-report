import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import TransactionForm from './TransactionForm';
import GeneralInfo from "./GeneralInfo";
import {Step, StepLabel, Stepper} from "@mui/material";

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

function getStepContent(step, model, setModel, setActiveStep) {
    switch (step) {
        case 0:
            return <GeneralInfo model={model} setModel={setModel} setActiveStep={setActiveStep}/>
        case 1:
            return <TransactionForm model={model} setModel={setModel} setActiveStep={setActiveStep}/>;
        default:
            throw new Error('Unknown step');
    }
}
export default function TransactionStepper({model, setModel}) {
    const [activeStep, setActiveStep] = React.useState(0);

    return (
        <React.Fragment>
            <CssBaseline/>
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
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
