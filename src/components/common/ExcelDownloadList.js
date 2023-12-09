import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { db } from '../../storage/firebase';
import { collection, getDocs, query, where } from "firebase/firestore"
import { saveAs } from "file-saver";

const ExcelDownloadList = ({ user, forwardedRef }) => {
    const [excelFiles, setExcelFiles] = useState([]);
    const [reload, setReload] = React.useState('')

    useEffect(() => {
        const fetchData = async () => {
            const q = query(collection(db, "reports"), where("user_id", "==", user.uid));
            try {
                const docs = await getDocs(q);

                const files = docs.docs.map((doc) => {
                    const { user_id, ...fileData } = doc.data();
                    return {
                        id: doc.id,
                        ...fileData,
                    };
                });

                setExcelFiles(files)
            } catch (e) {
                throw (e)
            }
            return []
        };

        fetchData();
    }, [reload]);

    React.useImperativeHandle(forwardedRef, () => ({
        setReload
    }));

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
                        <Typography variant="h6">{file.name}</Typography>
                    </ListItemText>
                    <ListItemSecondaryAction>
                        <IconButton
                            edge="end"
                            aria-label="download"
                            onClick={() => handleDownload(file.name)}
                        >
                            <CloudDownloadIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default ExcelDownloadList;
