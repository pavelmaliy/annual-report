import React, { useEffect} from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { Delete } from "@mui/icons-material";
import { saveAs } from "file-saver";

const ExcelDownloadList = ({ excelFiles, deleteReport }) => {

    useEffect(() => {

    }, [excelFiles]);

    const handleDownload = (filename) => {
        for (const excel of excelFiles) {
            if (excel.name === filename) {
                const blob = new Blob([excel.report], { type: "text/csv" });
                saveAs(blob, excel.name + ".csv"); // Specify the file name
                return
            }
        }
    };

    return (
        <List>
            {excelFiles.map((file) => (
                <ListItem key={file.id}>
                    <ListItemText>
                        <Typography variant="h6">{file.name + ".csv"}</Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                        <Box display="flex">
                            <IconButton
                                edge="end"
                                aria-label="download"
                                onClick={() => handleDownload(file.name)}
                            >
                                <CloudDownloadIcon />
                            </IconButton>
                            <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => deleteReport(file.id)}
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default ExcelDownloadList;
