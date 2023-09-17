import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

export default function Report() {
    return (
        <React.Fragment>
            <CssBaseline/>
            <Container component="main" maxWidth="lg" sx={{mb: 4}}>
                <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
                    <Typography component="h1" variant="h4" align="center" style={{marginBottom: '20px'}}>
                        New Report
                    </Typography>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <React.Fragment>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                    <LocalizationProvider required dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            renderInput={(params) => <TextField {...params} fullWidth />}
                                            shouldDisableDate={(date) => {
                                                return dayjs(date).isAfter(dayjs());
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
                                            shouldDisableDate={(date) => {
                                                return dayjs(date).isAfter(dayjs());
                                            }}
                                            labelId="end-date-label"
                                            label="End Date"
                                        />
                                    </LocalizationProvider>
                                        </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="alg-select-label">Alghorithm</InputLabel>
                                        <Select
                                            size="small"
                                            labelId="alg-select-label"
                                            id="simple-select"
                                            //value={transaction.transactionType}
                                            label="Alghoritm"
                                            onChange={(e) => {
                                            }}
                                        >
                                            <MenuItem value={10}>Optimized</MenuItem>
                                            <MenuItem value={20}>FIFO</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="format-select-label">Format</InputLabel>
                                        <Select
                                            size="small"
                                            labelId="format-select-label"
                                            id="simple-select"
                                            //value={transaction.transactionType}
                                            label="Format"
                                            onChange={(e) => {
                                            }}
                                        >
                                            <MenuItem value={10}>Simplified</MenuItem>
                                            <MenuItem value={20}>Official</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <div style={{ textAlign: 'right' }}>
                                    <Button
                                        variant="contained"
                                        sx={{mt: 3, ml: 1}}
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
        </React.Fragment>
    );
}