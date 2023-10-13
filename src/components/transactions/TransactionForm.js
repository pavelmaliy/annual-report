import * as React from 'react';
import {List, ListItem, ListItemSecondaryAction, ListItemText} from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import Box from "@mui/material/Box";
import InputFileUpload from "../common/InputFileUpload";
import {Delete} from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import xlsx from 'exceljs'
import FileDownloadButton from "../common/FileDownload";
import TransactionDialog from "./TransactionDialog";
import {formatDateToDDMMYYYY} from "../../utils/utils"
import {useContext} from "react";
import {AppContext} from "../../context/AppContext";
import "../../styles.css"

export default function TransactionForm({onFinish}) {
    const {model} = useContext(AppContext);
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
                worksheet.eachRow({includeEmpty: false}, function (row, rowNumber) {
                    if (rowNumber > 1) {
                        transactions.push({
                            "transactionDate": row.getCell(1).value,
                            "transactionType": row.getCell(2).value,
                            "stockName": row.getCell(3).value,
                            "quantity": parseInt(row.getCell(4).value),
                            "price": parseFloat(row.getCell(5).value),
                            "marketCurrency": row.getCell(6).value
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
                                clear all
                            </Button>
                        </Box>
                        <List style={{maxHeight: 300, overflow: 'auto'}}>
                            {transactionListItems.map((item, index) => (
                                <ListItem className={"listItem"} key={index}>
                                    <ListItemText
                                        primary={<Typography  variant="button" display="block"
                                                             gutterBottom>
                                            {formatDateToDDMMYYYY(item.transactionDate) + " " + item.transactionType + " \"" + item.stockName + "\" " + item.quantity + " " + item.price + item.marketCurrency}
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
                    variant="outlined"
                    startIcon={<AddIcon fontSize="large"/>}
                    onClick={handleClickOpen}
                >
                    Add New
                </Button>
                <InputFileUpload handleFileUpload={handleFileUpload}/>
                <FileDownloadButton filepath='/resources' filename='template.xlsx' />
            </Box>
            <TransactionDialog onFinish={onDialogFinish} open={open} setOpen={setOpen}/>
            <React.Fragment>
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button
                        sx={{mt: 3, ml: 1}}
                        onClick={() => {
                            onFinish(transactionListItems)
                        }}
                        disabled={transactionListItems.length === 0}
                    >
                        Save
                    </Button>
                </Box>
            </React.Fragment>
        </div>
    );
}

