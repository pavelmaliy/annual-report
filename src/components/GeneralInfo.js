import * as React from 'react';
import Grid from '@mui/material/Grid';
import currencies from "../resources/commonCurrency.json";
import exchanges from "../resources/stockExchange.json";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";


export default function GeneralInfoForm({model, setModel}) {
    const [currency, setCurrency] = React.useState('');
    const [exchange, setExchange] = React.useState('');

    const handleCurrency = (event) => {
        const {value} = event.target;
        setCurrency(value);
        model.currency = value
        setModel(model)
    };

    const handleExchange = (event) => {
        const {value} = event.target;
        setExchange(value);
        model.exchange = value
        setModel(model)
    };

    return (
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
    );
}
