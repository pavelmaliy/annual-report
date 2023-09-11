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
import TemplateDownloadButton from "./TemplateDownload";
import TransactionDialog from "./TransactionDialog";
import {formatDateToMMDDYYYY} from "../utils/utils"

export default function TransactionForm({model, onBack, onFinish}) {
    const [open, setOpen] = React.useState(false);
    const [transactionListItems, setTransactionListItems] = React.useState(model.transactions ? model.transactions : [])

    const onDialogFinish = (transaction) => {
        transactionListItems.push(transaction)
        setTransactionListItems(transactionListItems)
        setOpen(false);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleUploadAdd = (transactions) => {
        setTransactionListItems(transactionListItems.concat(transactions))
    }

    const handleDelete = (index) => {
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

        reader.onload = async (event) => {
            const fileContent = event.target.result;
            const workbook = new xlsx.Workbook()
            try {
                await workbook.xlsx.load(fileContent)
                let worksheet = workbook.getWorksheet('Sheet1');
                let transactions = []
                worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
                    if (rowNumber > 1) {
                        transactions.push({
                            "transactionDate": formatDateToMMDDYYYY(row.getCell(1).value),
                            "transactionType": row.getCell(2).value,
                            "stockName": row.getCell(3).value,
                            "quantity": row.getCell(4).value
                        })
                    }
                });
                handleUploadAdd(transactions)

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
                    <Paper elevation={1}>
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => {
                            setTransactionListItems([])
                        }}>
                            delete all
                        </Button>
                        </Box>
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
            <TransactionDialog onFinish={onDialogFinish} open={open} setOpen={setOpen}/>
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

