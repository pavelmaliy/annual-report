import * as React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import currencies from "../resources/commonCurrency.json";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";


export default function GeneralInfoForm({model, setModel}) {
    const [currency, setCurrency] = React.useState("USD");

    const handleCurrency = (event) => {
        const { value } = event.target;
        setCurrency(value);
        model.currency = value
        setModel(model)
    };

    return (
        <React.Fragment>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel id="currency-label">Currency</InputLabel>
                        <Select
                            size="small"
                            labelId="currency-label"
                            id="currency-select"
                            value={currency}
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
                <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        id="exchange"
                        name="exchange"
                        label="Stock exchange"
                        fullWidth
                        autoComplete="exchange"
                        variant="standard"
                        onChange={(e) => {
                            model["stockExchange"] = e.target.value;
                            setModel(model)
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
