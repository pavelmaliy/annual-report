import React from 'react';
import Button from "@mui/material/Button";
import { ReactComponent as ExcelIcon } from '../../icons/excel.svg';
import { saveAs } from "file-saver";

function FileDownloadButton({ filepath, filename }) {
    const handleDownload = () => {
        // Define the path to the sample file within your project
        const fullPath = filepath + "/" + filename; // Update the path to match your project
        saveAs(process.env.PUBLIC_URL + fullPath, filename)
    };

    return (
        <Button
            variant="outlined"
            onClick={handleDownload}
            startIcon={<ExcelIcon />}
        >Download Template</Button>
    );
}

export default FileDownloadButton;
