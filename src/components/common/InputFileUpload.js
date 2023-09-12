import * as React from 'react';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon/>}
                >
                    Upload Excel
                </Button>
            </label>
        </Box>
    );
}