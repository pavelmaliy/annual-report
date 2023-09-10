import * as React from 'react';
import Grid from '@mui/material/Grid';
import currencies from "../resources/commonCurrency.json";
import exchanges from "../resources/stockExchange.json";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";


export default function GeneralInfoForm({model, setModel, setActiveStep}) {
    const [currency, setCurrency] = React.useState('');
    const [exchange, setExchange] = React.useState('');
    const [currencyError, setCurrencyError] = React.useState('');
    const [exchangeError, setExchangeError] = React.useState('');

    const handleCurrency = (event) => {
        const {value} = event.target;
        setCurrency(value);
        setCurrencyError('')
        model.currency = value
        setModel(model)
    };

    const handleExchange = (event) => {
        const {value} = event.target;
        setExchange(value);
        setExchangeError('')
        model.exchange = value
        setModel(model)
    };

    const handleNext = () => {
        let validationError = false
        if (currency.length === 0) {
            setCurrencyError('cannot be empty')
            validationError = true
        }
        if (exchange.length === 0) {
            setExchangeError('cannot be empty')
            validationError = true
        }
        if (validationError) {
            return
        }
        setActiveStep(1)
    }

    return (
        <>
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="exchange-select-label" required>Stock Exchange</InputLabel>
                        <Select
                            size="small"
                            labelId="exchange-select-label"
                            id="exchange-select"
                            value={exchange}
                            label="Stock Exchange"
                            onChange={handleExchange}
                            error={exchangeError}
                        >
                            {Object.keys(exchanges).map((exchange) => (
                                <MenuItem key={exchange} value={exchange}>
                                    {exchange} - {exchanges[exchange].name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="currency-select-label" required>Local Currency</InputLabel>
                        <Select
                            size="small"
                            labelId="currency-select-label"
                            id="currency-select"
                            value={currency}
                            label="Local Currency"
                            onChange={handleCurrency}
                            error={currencyError}
                        >
                            {Object.keys(currencies).map((currency) => (
                                <MenuItem key={currency} value={currency}>
                                    {currency} - {currencies[currency].name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </React.Fragment>
    <React.Fragment>
        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
                variant="contained"
                sx={{mt: 3, ml: 1}}
                onClick={handleNext}
            >
                Next
            </Button>
        </Box>
    </React.Fragment>
    </>
    );
}
