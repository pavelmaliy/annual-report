import * as React from 'react';
import {
    DialogContent,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
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
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import InputFileUpload from "./InputFileUpload";
import {Delete} from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import './TransactionForm.css'
import xlsx from 'exceljs'
import dayjs from 'dayjs';
import TemplateDownloadButton from "./TemplateDownload";

export default function TransactionForm({model, onBack, onFinish}) {
    const [open, setOpen] = React.useState(false);
    const [transaction, setTransaction] = React.useState({})
    const [transactionListItems, setTransactionListItems] = React.useState(model.transactions)
    const [stockNameError, setStockNameError] = React.useState('');
    const [quantityError, setQuantityError] = React.useState('');

    const formatDateToMMDDYYYY = function (millis) {
        if (isNaN(millis)) {
            millis = new Date().getTime()
        }
        let date = new Date(millis)
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    }
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setStockNameError('')
        setQuantityError('')
    };
    const handleAdd = () => {
        let validationError = false
        if (!transaction.stockName) {
            setStockNameError('cannot be empty')
            validationError = true
        }
        if (!transaction.quantity) {
            setQuantityError('cannot be empty')
            validationError = true
        }
        if (validationError) {
            return
        }
        transactionListItems.push(transaction)
        setTransactionListItems(transactionListItems)
        setTransaction({})
        setOpen(false);
    };
    const handleDelete = (index) => {
        let newTransactions = model.transactions.slice()
        newTransactions.splice(index, 1)
        let newItems = transactionListItems.slice()
        newItems.splice(index, 1)
        setTransactionListItems(newItems)
    };

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            // No file selected
            return;
        }

        const reader = new FileReader();
        const workbook = new xlsx.Workbook();

        reader.onload = async (event) => {
            const fileContent = event.target.result;
            const workbook = new xlsx.Workbook()
            try {
                await workbook.xlsx.load(fileContent)
                var worksheet = workbook.getWorksheet('Sheet1');
                worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
                    console.log("Row " + rowNumber + " = " + JSON.stringify(row.values));
                });

            } catch (error) {
                throw error
            }
        }
        reader.readAsArrayBuffer(selectedFile);
    }

    return (
        <div>
            {transactionListItems.length > 0 ? (
                <div>
                    <Paper elevation={1} gutterBottom>
                        <List style={{maxHeight: 300, overflow: 'auto'}}>
                            {transactionListItems.map((item, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={<Typography className="framed-text" variant="button" display="block" gutterBottom>
                                            { formatDateToMMDDYYYY(item.transactionDate) + " " + ((item.transactionType === 10) ? "sell" : "purchase") + " "  + item.stockName + " " + item.quantity}
                                        </Typography>}/>
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                                            <Delete/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Box mb={2}/>
                </div>
            ) : (
                <div/>
            )}

            <Box display="flex" justifyContent="center">
                <Button
                    style={{marginRight: '10px'}}
                    component="label"
                    variant="contained"
                    startIcon={<AddIcon fontSize="large"/>}
                    onClick={handleClickOpen}
                >
                    Add New
                </Button>
                <InputFileUpload handleFileUpload={handleFileUpload}/>
                <TemplateDownloadButton/>
            </Box>
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
            <React.Fragment>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        onClick={()=> {
                            onBack(transactionListItems)
                        }}
                        sx={{mt: 3, ml: 1}}
                    >
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        sx={{mt: 3, ml: 1}}
                        onClick={()=> {
                            onFinish(transactionListItems)
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </React.Fragment>
        </div>
    );
}

