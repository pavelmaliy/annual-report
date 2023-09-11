import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import {DialogContent, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import * as React from "react";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {formatDateToMMDDYYYY} from "../utils/utils"

export default function TransactionDialog({onFinish, open, setOpen}) {
    const [stockNameError, setStockNameError] = React.useState('');
    const [quantityError, setQuantityError] = React.useState('');
    const [transaction, setTransaction] = React.useState({})
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
        if (validationError) {
            return
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
                                    transaction.quantity = e.target.value;
                                    setTransaction(transaction)
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <LocalizationProvider required dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    shouldDisableDate={(date)=>{return dayjs(date).isAfter(dayjs());}}
                                    labelId="transaction-date-label"
                                    label="Transaction Date"
                                    onChange={(val) => {
                                        transaction.transactionDate = formatDateToMMDDYYYY(val)
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
                                    value={transaction.transactionType}
                                    label="Transaction Type"
                                    onChange={(e) => {
                                        transaction.transactionType = e.target.value
                                        setTransaction(transaction)
                                    }}
                                >
                                    <MenuItem value={10}>Sell</MenuItem>
                                    <MenuItem value={20}>Purchase</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
        </Dialog>
    );
}