import React, {useState} from 'react';
import {IconButton, List, ListItem, ListItemSecondaryAction, ListItemText} from '@mui/material';
import {Delete} from '@mui/icons-material';
import Paper from "@mui/material/Paper";

function ListWithRemove(props) {
    const {transactions, removeTransaction} = props
    const [localTransactions, setLocalTransactions] = useState(transactions);

    const handleDelete = function (index) {
        removeTransaction(index)
        let newTransactions = []
        localTransactions.map((tr, i) => {
            if (i !== index) {
                newTransactions.push(tr)
            }
        })
        setLocalTransactions(newTransactions)
    }

    return (
        <div>
            <Paper elevation={3} style={{padding: '16px'}}>
                <List style={{maxHeight: 300, overflow: 'auto'}}>
                    {localTransactions.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={JSON.stringify(item)}/>
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                                    <Delete/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </div>
    );
}

export default ListWithRemove;
