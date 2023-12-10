import CloseIcon from "@mui/icons-material/Close";
import { DialogContent, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import * as React from "react";
import currencies from "../../resources/commonCurrency.json";

export default function TransactionDialog({onFinish, open, setOpen}) {
    const [stockNameError, setStockNameError] = React.useState('');
    const [quantityError, setQuantityError] = React.useState('');
    const [priceError, setPriceError] = React.useState('');
    const [transaction, setTransaction] = React.useState({})
    const [marketCurrError, setMarketCurrError] = React.useState('');

    const handleAdd = () => {
        let validationError = false
        if (!transaction.stockName) {
            setStockNameError('cannot be empty')
            validationError = true
        }
        if (!transaction.quantity || transaction.quantity < 0) {
            setQuantityError('not valid number')
            validationError = true
        }
        if (!transaction.price || transaction.price < 0) {
            setPriceError('not valid number')
            validationError = true
        }

        if (transaction.transactionDate && transaction.transactionDate.toString() === 'Invalid Date') {
            validationError = true
        }

        if (validationError) {
            return
        }

        if (!transaction.marketCurrency) {
            transaction.marketCurrency = 'EUR'
        }

        if (!transaction.transactionType) {
            transaction.transactionType="Sell"
        }

        if (!transaction.transactionDate) {
            transaction.transactionDate = new Date().getTime()
        }
        onFinish(transaction)
        setTransaction({})
    };

    const handleClose = () => {
        setOpen(false);
        setStockNameError('')
        setQuantityError('')
    }

    return (
        <Dialog open={open} fullWidth>
            <AppBar sx={{position: 'relative'}}>
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon/>
                    </IconButton>
                    <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                        New Transaction
                    </Typography>
                    <Button autoFocus color="inherit" onClick={handleAdd}>
                        Add
                    </Button>
                </Toolbar>
            </AppBar>
            <DialogContent sx={{position: 'relative'}}>
                <form>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="stockName"
                                label="Stock Name"
                                fullWidth
                                autoComplete="st-name"
                                variant="standard"
                                error={!!stockNameError}
                                helperText={stockNameError}
                                onChange={(e) => {
                                    setStockNameError('')
                                    transaction.stockName = e.target.value;
                                    setTransaction(transaction)
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="quantity"
                                label="Quantity"
                                fullWidth
                                autoComplete="st-quantity"
                                variant="standard"
                                error={!!quantityError}
                                helperText={quantityError}
                                onChange={(e) => {
                                    setQuantityError('')
                                    transaction.quantity = parseInt(e.target.value);
                                    setTransaction(transaction)
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                required
                                id="price"
                                label="Price"
                                fullWidth
                                autoComplete="price"
                                variant="standard"
                                error={!!priceError}
                                helperText={priceError}
                                onChange={(e) => {
                                    setPriceError('')
                                    transaction.price = parseFloat(e.target.value);
                                    setTransaction(transaction)
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider required dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    shouldDisableDate={(date) => {
                                        return dayjs(date).isAfter(dayjs());
                                    }}
                                    labelId="transaction-date-label"
                                    label="Transaction Date"
                                    format="DD/MM/YYYY"
                                    defaultValue={dayjs()}                                    
                                    onChange={(val) => {                                                                            
                                        transaction.transactionDate = val
                                        setTransaction(transaction)
                                    }}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="transaction-select-label">Transaction Type</InputLabel>
                                <Select
                                    size="small"
                                    labelId="transaction-select-label"
                                    id="simple-select"
                                    defaultValue={10}
                                    label="Transaction Type"
                                    onChange={(e) => {
                                        transaction.transactionType = ((e.target.value === 10) ? 'Sell' : 'Purchase')
                                        setTransaction(transaction)
                                    }}
                                >
                                    <MenuItem value={10}>Sell</MenuItem>
                                    <MenuItem value={20}>Purchase</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="exchange-select-label" >Market Currency</InputLabel>
                                <Select
                                    size="small"
                                    labelId="exchange-select-label"
                                    id="exchange-select"
                                    defaultValue={'EUR'}
                                    label="Market Currency"
                                    onChange={(event) => {
                                        transaction.marketCurrency = event.target.value
                                        setMarketCurrError('')
                                        setTransaction(transaction)
                                    }}
                                    error={!!marketCurrError}
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
                </form>
            </DialogContent>
        </Dialog>
    );
}