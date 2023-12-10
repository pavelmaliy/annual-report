import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import * as React from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../storage/firebase";
import { updateTransactions, saveReport } from "../../storage/store";
import { generateOptimizedReport } from "../../report/report"
import { saveAs } from "file-saver";
import ExcelDownloadList from "../common/ExcelDownloadList"
import { formatDateToDDMMYYYY, generateRandomString } from "../../utils/utils";

export default function Report() {
    const [algorithm, setAlgorithm] = React.useState(10);
    const [format, setFormat] = React.useState(10);
    const [from, setFrom] = React.useState(dayjs().set('year', dayjs().year()).set('month', 0).set('date', 1))
    const [fromDateError, setFromDateError] = React.useState('')
    const [to, setTo] = React.useState(dayjs())
    const [reportName, setReportName] = React.useState('report-' + formatDateToDDMMYYYY(new Date().getTime(), "_"))
    const [nameError, setNameError] = React.useState('')
    const [toDateError, setToDateError] = React.useState('')
    const [user] = useAuthState(auth)
    const childRef = React.useRef(null);

    const generateReport = async () => {
        let csv = ''
        let startDate = new Date(from)
        let endDate = to ? new Date(to) : new Date()

        if (validateForm(startDate, endDate)) {
            return
        }

        const sellsQuery = query(collection(db, "transactions"),
            where('transactionDate', '>=', startDate),
            where('transactionDate', '<=', endDate),
            where('transactionType', '==', 'Sell'),
            where("user_id", "==", user.uid),
            orderBy('transactionDate', 'asc')
        );
        const buyQuery = query(collection(db, "transactions"),
            where('transactionDate', '<=', endDate),
            where('transactionType', '==', 'Purchase'),
            where("user_id", "==", user.uid),
            orderBy('transactionDate', 'asc')
        );
        let sellTransactions = []
        let buyTransactions = []
        let earliestTimestamp = null
        try {
            const selldocs = await getDocs(sellsQuery);
            selldocs.docs.map((item) => {
                let tr = { ...item.data(), "id": item.id }
                sellTransactions.push(tr)
            })
            const buydocs = await getDocs(buyQuery);
            buydocs.docs.map((item) => {
                let tr = { ...item.data(), "id": item.id }
                // first transaction is the earliest because of sort
                if (buyTransactions.length == 0) {
                    earliestTimestamp = tr.transactionDate.toDate()
                    // might be weekend so we take 2 previos days as buffer
                    earliestTimestamp.setDate(earliestTimestamp.getDate() - 2)
                }
                buyTransactions.push(tr)
            })

            if (algorithm === 10) {
                csv = await generateOptimizedReport(sellTransactions, buyTransactions, earliestTimestamp)
            }

            if (format == 20) {
                let newTransactions = []
                const concatenatedArray = sellTransactions.concat(buyTransactions);
                for (const element of concatenatedArray) {
                    if (element["quantity"] != element["originalQuantity"]) {
                        newTransactions.push(element)
                    }
                }

                // save csv
                try {
                    if (csv.length > 0) {
                        await saveReport(csv, user, reportName)
                    }
                    if (childRef.current) {
                        childRef.current.setReload(generateRandomString(8))
                    }
                } catch (err) {
                    throw err
                }
                // update reported transactions
                // try {
                //     if (newTransactions.length > 0) {
                //         await updateTransactions(newTransactions)
                //     }
                // } catch (err) {
                //     throw err
                // }
            }

            downloadCSV(csv)
        }
        catch (e) {
            console.error(e)

        }
    }

    function downloadCSV(csvContent) {
        const blob = new Blob([csvContent], { type: "text/csv" });
        saveAs(blob, reportName + ".csv"); // Specify the file name
    }

    const validateForm = (startDate, endDate) => {
        let validationError = false
        let now = new Date().getTime()

        if (reportName.length == 0) {
            setNameError('cannot be empty')
            validationError = true
        }

        if (startDate.toString() === 'Invalid Date') {
            setFromDateError('invalid date')
            validationError = true
        }

        if (endDate.toString() === 'Invalid Date') {
            setToDateError('invalid date')
            validationError = true
        }

        if (!validationError) {
            if (startDate > now) {
                setFromDateError('future date not allowed')
                validationError = true
            }

            if (endDate > now) {
                setToDateError('future dates not allowed')
                validationError = true
            }
        }

        if (!validationError) {
            if (startDate > endDate) {
                setFromDateError('start date after end date')
                validationError = true
            }
        }

        if (!validationError) {
            setFromDateError('')
            setToDateError('')
        }

        return validationError
    }

    return (
        <React.Fragment>
            <CssBaseline />
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center" style={{ marginBottom: '20px' }}>
                        New Report
                    </Typography>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <LocalizationProvider required dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                renderInput={(params) => <TextField {...params} fullWidth />}
                                                shouldDisableDate={(date) => {
                                                    return dayjs(date).isAfter(dayjs());
                                                }}
                                                onChange={(val) => {
                                                    setFrom(val)
                                                    setFromDateError('')
                                                }}
                                                defaultValue={from}
                                                slotProps={{
                                                    textField: {
                                                        error: !!fromDateError,
                                                        helperText: fromDateError
                                                    }
                                                }}
                                                labelId="start-date-label"
                                                label="Start Date"
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <LocalizationProvider required dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                format="DD/MM/YYYY"
                                                shouldDisableDate={(date) => {
                                                    return dayjs(date).isAfter(dayjs());
                                                }}
                                                onChange={(val) => {
                                                    setTo(val)
                                                    setToDateError('')
                                                }}
                                                defaultValue={to}
                                                slotProps={{
                                                    textField: {
                                                        error: !!toDateError,
                                                        helperText: toDateError
                                                    }
                                                }}
                                                labelId="end-date-label"
                                                label="End Date"
                                            />
                                        </LocalizationProvider>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="alg-select-label">Algorithm</InputLabel>
                                        <Select
                                            size="small"
                                            labelId="alg-select-label"
                                            id="simple-select"
                                            value={algorithm}
                                            label="Algoritm"
                                            onChange={(e) => {
                                                setAlgorithm(e.target.value)
                                            }}
                                        >
                                            <MenuItem value={10}>Optimized</MenuItem>
                                            <MenuItem value={20}>FIFO</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="format-select-label">Type</InputLabel>
                                        <Select
                                            size="small"
                                            labelId="format-select-label"
                                            id="simple-select"
                                            value={format}
                                            label="Type"
                                            onChange={(e) => {
                                                setFormat(e.target.value)
                                            }}
                                        >
                                            <MenuItem value={10}>Preview</MenuItem>
                                            <MenuItem value={20}>Submit</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> */}
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="name"
                                            label="Report Name"
                                            name="name"
                                            defaultValue={reportName}
                                            error={!!nameError}
                                            helperText={nameError}                                            
                                            onChange={(e) => {
                                               setReportName(e.target.value)
                                               setNameError('')
                                            }}                                          
                                        >

                                        </TextField>
                                    {/* </Box> */}
                                </Grid>
                                <Grid item xs={12}>
                                    <div style={{ textAlign: 'right' }}>
                                        <Button
                                            variant="outlined"
                                            sx={{ mt: 3, ml: 1 }}
                                            onClick={generateReport}
                                        >
                                            Generate
                                    </Button>
                                    </div>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                    </Box>
                </Paper>
            </Container>
            <Container component="main" maxWidth="lg" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center" style={{ marginBottom: '12px' }}>
                        My Reports
                    </Typography>
                    <React.Fragment>
                        <ExcelDownloadList user={user} forwardedRef={childRef} />
                    </React.Fragment>
                </Paper>
            </Container>
        </React.Fragment>
    );
}