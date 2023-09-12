import React from 'react';
import Button from "@mui/material/Button";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";

function FileDownloadButton({filepath, filename}) {
    const handleDownload = () => {
        // Define the path to the sample file within your project
        const fullPath = filepath + "/" + filename; // Update the path to match your project

        // Create a new anchor element
        const anchor = document.createElement('a');
        anchor.href = process.env.PUBLIC_URL + fullPath; // Use PUBLIC_URL to get the correct path
        anchor.download = filename; // Specify the file name

        // Trigger a click event on the anchor element to initiate the download
        anchor.click();

        // Cleanup: Remove the anchor element
        anchor.remove()
    };

    return (
        <Button
            variant="contained"
            onClick={handleDownload}
            startIcon={<CloudDownloadIcon/>}
        >Download Excel Template</Button>
    );
}

export default FileDownloadButton;
