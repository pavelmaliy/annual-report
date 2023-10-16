import * as React from 'react';
import Button from '@mui/material/Button';
import { ReactComponent as ExcelIcon } from '../../icons/excel.svg';
import Box from "@mui/material/Box";
import xlsx from "exceljs";
import {collection, doc, runTransaction} from "firebase/firestore";
import {db} from "../../storage/firebase";
import LoadingScreen from '../common/LoadingScreen';
import {useState} from 'react';



export default function CurrencyUpload() {
    const [uploading, setUploading] = useState(false)
    async function readCSV(file) {
        // Create a new workbook
        const workbook = new xlsx.Workbook();
        // Create a new worksheet
        const worksheet = workbook.addWorksheet('Sheet 1');
        // Read the file as text
        const csvData = await file.text();
        // Parse the CSV data
        const csvRows = csvData.split('\n');
        csvRows.forEach((csvRow) => {
            const csvColumns = csvRow.split(',');

            // Add each column to the worksheet
            worksheet.addRow(csvColumns);
        });
        // Return the workbook
        return workbook.getWorksheet('Sheet 1');
    }

    const handleFileUpload = async (e) => {
        setUploading(true)
        const selectedFile = e.target.files[0];
        if (!selectedFile) {
            // No file selected
            return;
        }
        let collectionName = selectedFile.name.split(".")[0].toLowerCase()
        try {
            const worksheet = await readCSV(selectedFile);
            let currency = []
            worksheet.eachRow({includeEmpty: false}, function (row, rowNumber) {
                if (rowNumber > 1) {
                    currency.push({
                        "date": convertDateStringToDate(row.getCell(1).value.split('"').join('')),
                        "rate": row.getCell(2).value.split('"').join('')
                    })
                }
            });

            let colRef = collection(db, collectionName)

            await runTransaction(db, async (transaction) => {
                currency.map(item => {
                    transaction.set(doc(colRef), item)
                })
            });
            setUploading(false)
        } catch(e) {
            setUploading(true)
            throw e
        }
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" style={{marginRight: '10px'}}>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{display: 'none'}}
                id="file-upload-input"
            />
            <label htmlFor="file-upload-input">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<ExcelIcon/>}
                >
                    Upload
                </Button>
            </label>
            {(uploading) ? (
                <LoadingScreen/>
            ) : (
                <div></div>
            )}
        </Box>
    );
}

function convertDateStringToDate(dateString) {
    const [day, month, year] = dateString.split('.').map(Number);
  
    // Creating a new Date object with the year, month, and day
    // Note: Month is 0-based in JavaScript, so we subtract 1 from the month
    return new Date(year, month - 1, day);
  }