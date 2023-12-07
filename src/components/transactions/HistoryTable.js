import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useEffect } from "react";
import ReactLoading from "react-loading";
import currencies from "../../resources/commonCurrency.json";
import { getUserTransactions, deleteTransaction } from "../../storage/store";
import { formatDateToDDMMYYYY, generateRandomString } from "../../utils/utils";
import IconButton from '@mui/material/IconButton';
import { Delete } from "@mui/icons-material";

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

export function HistoryTable({ user, forwardedRef }) {
    const rowsPerPageOptions = [5, 10, 25];
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortConfig, setSortConfig] = React.useState({ key: '', direction: '' });
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [history, setHistory] = React.useState([])
    const [reloadHistory, setReloadHistory] = React.useState('')

    useEffect(() => {
        (async () => {
            let docs = await getUserTransactions(user)
            let newHistory = []
            docs.map((item) => {
                newHistory.push(item)
            })
            setHistory(newHistory)
            setLoading(false);
        })()
    }, [reloadHistory]);

    React.useImperativeHandle(forwardedRef, () => ({
        setReloadHistory
    }));

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when changing rows per page
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...history].sort((a, b) => {
        let firstCell = a.data()[sortConfig.key]
        let secondCell = b.data()[sortConfig.key]


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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleDelete= async (id) => {
        await deleteTransaction(id)
        setReloadHistory(generateRandomString(8))
    }

    return (
        <div>
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
                                    <Typography style={{ fontWeight: 'bold' }}>
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
                                    <Typography style={{ fontWeight: 'bold' }}>
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
                                    <Typography style={{ fontWeight: 'bold' }}>
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
                                    <Typography style={{ fontWeight: 'bold' }}>
                                        Quantity
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'price'}
                                    direction={sortConfig.key === 'price' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('price')}
                                >
                                    <Typography style={{ fontWeight: 'bold' }}>
                                        Price
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'marketCurrency'}
                                    direction={sortConfig.key === 'marketCurrency' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('marketCurrency')}
                                >
                                    <Typography style={{ fontWeight: 'bold' }}>
                                        Currency
                                    </Typography>
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <Typography style={{ fontWeight: 'bold' }}>
                                    Delete
                                    </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    {loading ? (
                        <TableBody>
                            <TableRow>
                                <TableCell>
                                    <ReactLoading type="bubbles" color="#0000FF" />
                                </TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                            </TableRow>
                        </TableBody>
                    ) : (
                            <TableBody>
                                {sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
                                    return (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Typography>
                                                    {formatDateToDDMMYYYY(item.data().transactionDate.toMillis())}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {item.data().stockName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {item.data().transactionType}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {item.data().quantity}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {item.data().price}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {currencies[item.data().marketCurrency].symbol}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}

                            </TableBody>
                        )}
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
        </div>
    );
}