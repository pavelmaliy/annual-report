import * as React from 'react';
import {DialogContent, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import Grid from '@mui/material/Grid';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Button from "@mui/material/Button";
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import CssBaseline from "@mui/material/CssBaseline";
import ListWithRemove from "./ListWithRemove";
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";

export default function TransactionForm({model, setModel}) {
    const [open, setOpen] = React.useState(false);
    const [transactionType, setTransactionType] = React.useState(10)
    const [transaction, setTransaction] = React.useState({
        "quantity": 0,
        "stockName": "",
        "transactionType": 10,
        "transactionDate": ""
    });
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleAdd = () => {
        model.transactions.push(transaction)
        setTransaction({
            "quantity": 0,
            "stockName": "",
            "transactionType": 10,
            "transactionDate": ""
        })
        setModel(model)
        setOpen(false);
    };

    return (
        <div>
            <ListWithRemove transactions={model.transactions} removeTransaction={(index) => {
                let newTransactions = []
                model.transactions.map((tr, i) => {
                    if (i !== index) {
                        newTransactions.push(tr)
                    }
                })
                model.transactions = newTransactions
                setModel(model)
            }}/>
            <Box display="flex" justifyContent="center">
                <IconButton tooltip="new transaction" onClick={handleClickOpen}>
                    <AddIcon color="primary" fontSize="large"/>
                </IconButton>
            </Box>
            <CssBaseline/>
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
                                    onChange={(e) => {
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
                                    onChange={(e) => {
                                        transaction.quantity = e.target.value;
                                        setTransaction(transaction)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider required dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        labelId="transaction-date-label"
                                        label="Transaction Date"
                                        onChange={(val) => {
                                            transaction.transactionDate = val
                                            setTransaction(transaction)
                                        }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="transaction-select-label" required>Transaction Type</InputLabel>
                                    <Select
                                        labelId="transaction-select-label"
                                        id="simple-select"
                                        value={transactionType}
                                        label="Transaction Type"
                                        onChange={(e) => {
                                            setTransactionType(e.target.value)
                                            transaction.transactionType = transactionType
                                            setTransaction(transaction)
                                        }}
                                    >
                                        <MenuItem value={10}>Sell</MenuItem>
                                        <MenuItem value={20}>Buy</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
