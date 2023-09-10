import * as React from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from "@mui/material/Box";
import {Input} from "@mui/material";

export default function InputFileUpload({handleFileUpload}) {
    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload-input"
            />
            <label htmlFor="file-upload-input">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                >
                    Upload File
                </Button>
            </label>
        </Box>
    );
}