import * as React from 'react';
import {useContext, useEffect} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TransactionForm from './TransactionForm';
import GeneralInfo from "./GeneralInfo";
import {
    Step,
    StepLabel,
    Stepper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from "@mui/material";
import {getUserTransactions, persistTransactions} from "../../storage/store"
import {AppContext} from "../../context/AppContext";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../storage/firebase";

const steps = ['General Info', 'Stock Transactions'];

const styles = {
    tableHeaderStyle: {
        position: 'sticky',
        top: 0,
        background: 'white',
        zIndex: 1,
    },
    tableWrapper: {
        position: 'relative',
        overflowX: 'auto',
        maxHeight: '400px', // Set the maximum height for vertical scrolling
        overflowY: 'auto'
    },
    pagination: {
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'white', // Adjust this based on your table background
        zIndex: 1, // Ensure it's above the table content
    },
};

export default function TransactionStepper() {
    const {model, setModel} = useContext(AppContext);
    const [activeStep, setActiveStep] = React.useState(0);
    const [user] = useAuthState(auth)
    const [history, setHistory] = React.useState([])
    const [loading, setLoading] = React.useState(true);
    const rowsPerPageOptions = [5, 10, 25];
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortConfig, setSortConfig] = React.useState({key: '', direction: ''});

    useEffect(() => {
        (async () => {
            let docs = await getUserTransactions(user)
            let newHistory = []
            docs.map((item) => {
                newHistory.push(item.data())
            })
            setHistory(newHistory)
            setLoading(false);
        })()
    }, []);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({key, direction});
    };

    const sortedData = [...history].sort((a, b) => {
        let firstCell = a[sortConfig.key]
        let secondCell = b[sortConfig.key]
        if (sortConfig.direction === 'asc') {
            if (firstCell && firstCell.localeCompare) {
                return firstCell.localeCompare(secondCell)
            }
            return firstCell - secondCell;
        }
        if (secondCell && secondCell.localeCompare) {
            return secondCell.localeCompare(firstCell)
        }
        return secondCell - firstCell
    });

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <GeneralInfo onFinish={(props) => {
                    model.currency = props.currency
                    model.exchange = props.exchange
                    setModel(model)
                    setActiveStep(1)
                }}/>
            case 1:
                return <TransactionForm
                    onBack={(transactions) => {
                        setActiveStep(0)
                        model.transactions = transactions
                        setModel(model)
                    }}
                    onFinish={async (transactions) => {
                        try {
                            await persistTransactions(transactions, user)
                        } catch (err) {
                            throw err
                        }
                        model.transactions = transactions
                        setModel(model)
                        setActiveStep(2)

                    }}/>;
            default:
                throw new Error('Unknown step');
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when changing rows per page
    };

    function NewTransaction() {
        return (
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Typography component="h1" variant="h4" align="center">
                        New Transaction
                    </Typography>
                    <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <React.Fragment>
                            <Typography variant="h5" gutterBottom>
                                Transactions successfully saved.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    model.transactions = []
                                    model.currency = ''
                                    model.exchange = ''
                                    setModel(model)
                                    setActiveStep(0);
                                }}
                                sx={{mt: 3, ml: 1}}
                            >
                                Finish
                            </Button>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            {getStepContent(activeStep, model, setModel, setActiveStep)}
                        </React.Fragment>
                    )}
                </Paper>
            </Container>
        );
    }

    return (
        <div>
            {(loading) ? (
                <React.Fragment>
                    <CssBaseline/>
                    <NewTransaction/>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <CssBaseline/>
                    <NewTransaction/>
                    <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                            <Typography component="h1" variant="h4" align="center" style={{marginBottom: '12px'}}>
                                Transaction History
                            </Typography>
                            <React.Fragment>
                                <TableContainer component={Paper} style={styles.tableWrapper}>
                                    <Table>
                                        <TableHead style={styles.tableHeaderStyle}>
                                            <TableRow>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortConfig.key === 'transactionDate'}
                                                        direction={sortConfig.key === 'transactionDate' ? sortConfig.direction : 'asc'}
                                                        onClick={() => handleSort('transactionDate')}
                                                    >
                                                        <Typography style={{fontWeight: 'bold'}}>
                                                            Date
                                                        </Typography>
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortConfig.key === 'stockName'}
                                                        direction={sortConfig.key === 'stockName' ? sortConfig.direction : 'asc'}
                                                        onClick={() => handleSort('stockName')}
                                                    >
                                                        <Typography style={{fontWeight: 'bold'}}>
                                                            Stock
                                                        </Typography>
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortConfig.key === 'transactionType'}
                                                        direction={sortConfig.key === 'transactionType' ? sortConfig.direction : 'asc'}
                                                        onClick={() => handleSort('transactionType')}
                                                    >
                                                        <Typography style={{fontWeight: 'bold'}}>
                                                            Action
                                                        </Typography>
                                                    </TableSortLabel>
                                                </TableCell>
                                                <TableCell>
                                                    <TableSortLabel
                                                        active={sortConfig.key === 'quantity'}
                                                        direction={sortConfig.key === 'quantity' ? sortConfig.direction : 'asc'}
                                                        onClick={() => handleSort('quantity')}
                                                    >
                                                        <Typography style={{fontWeight: 'bold'}}>
                                                            Quantity
                                                        </Typography>
                                                    </TableSortLabel>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.transactionDate}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.stockName}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.transactionType}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>
                                                            {item.quantity}
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                        </TableBody>
                                    </Table>
                                    <TablePagination
                                        style={styles.pagination}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        component="div"
                                        count={history.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={handleChangePage}
                                        onRowsPerPageChange={handleChangeRowsPerPage}
                                    />
                                </TableContainer>
                            </React.Fragment>
                        </Paper>
                    </Container>
                </React.Fragment>
            )}
        </div>
    );
}

