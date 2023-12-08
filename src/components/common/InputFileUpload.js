import React, { useRef } from 'react';
import Button from '@mui/material/Button';
import { ReactComponent as ExcelIcon } from '../../icons/excel.svg';
import Box from "@mui/material/Box";

export default function InputFileUpload({ handleFileUpload }) {
    const fileInputRef = useRef(null);

    const onUpload = function (event) {
        const selectedFile = event.target.files[0];
        handleFileUpload(event)

        if (selectedFile) {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" style={{ marginRight: '10px' }}>
            <input
                type="file"
                accept=".xlsx"
                onChange={onUpload}
                style={{ display: 'none' }}
                id="file-upload-input"
                ref={fileInputRef}
            />
            <label htmlFor="file-upload-input">
                <Button
                    variant="outlined"
                    component="span"
                    startIcon={<ExcelIcon />}
                >
                    Upload
                </Button>
            </label>
        </Box>
    );
}