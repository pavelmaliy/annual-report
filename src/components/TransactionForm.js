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

export default function TransactionForm({model, setModel}) {
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleClickOpen}>
                Add Transaction
            </Button>
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
                        <Button autoFocus color="inherit" onClick={handleClose}>
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
                                        model["stockName"] = e.target.value;
                                        setModel(model)
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
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <LocalizationProvider required dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        labelId="transaction-date-label"
                                        label="Transaction Date"
                                        onChange={(val) => {
                                            model["transactionDate"] = val
                                            setModel(model)
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
                                        value={model.transaction}
                                        label="Transaction Type"
                                        onChange={(e) => {
                                            model["transaction"] = e.target.value
                                            setModel(model)
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
