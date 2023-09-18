import * as React from 'react';
import Grid from '@mui/material/Grid';
import currencies from "../../resources/commonCurrency.json";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {useContext} from "react";
import {AppContext} from "../../context/AppContext";


export default function GeneralInfoForm({onFinish}) {
    const {model} = useContext(AppContext);

    const [currency, setCurrency] = React.useState(model.currency ? model.currency : 'ILS');
    const [marketCurrency, setMarketCurrency] = React.useState(model.exchange ? model.exchange : 'EUR');
    const [currencyError, setCurrencyError] = React.useState(false);
    const [marketCurrError, setMarketCurrError] = React.useState(false);

    const handleCurrency = (event) => {
        const {value} = event.target;
        setCurrency(value);
        setCurrencyError(false)
    };

    const handleMarketCurrency = (event) => {
        const {value} = event.target;
        setMarketCurrency(value);
        setMarketCurrError(false)
    };

    const handleNext = () => {
        let validationError = false
        if (!currency) {
            setCurrencyError(true)
            validationError = true
        }
        if (!marketCurrency) {
            setMarketCurrError(true)
            validationError = true
        }
        if (validationError) {
            return
        }

        onFinish({
            currency,
            marketCurrency
        })
    }

    return (
        <>
            <React.Fragment>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="exchange-select-label" required>Market Currency</InputLabel>
                            <Select
                                size="small"
                                labelId="exchange-select-label"
                                id="exchange-select"
                                value={marketCurrency}
                                label="Market Currency"
                                onChange={handleMarketCurrency}
                                error={marketCurrError}
                            >
                                {Object.keys(currencies).map((currency) => (
                                    <MenuItem key={currency} value={currency}>
                                        {currency} - {currencies[currency].name}
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
