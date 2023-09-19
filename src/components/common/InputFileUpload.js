import * as React from 'react';
import Button from '@mui/material/Button';
import { ReactComponent as ExcelIcon } from '../../icons/excel.svg';
import Box from "@mui/material/Box";

export default function InputFileUpload({handleFileUpload}) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" style={{marginRight: '10px'}}>
            <input
                type="file"
                accept=".xlsx"
                onChange={handleFileUpload}
                style={{display: 'none'}}
                id="file-upload-input"
            />
            <label htmlFor="file-upload-input">
                <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ExcelIcon/>}
                >
                    Upload
                </Button>
            </label>
        </Box>
    );
}