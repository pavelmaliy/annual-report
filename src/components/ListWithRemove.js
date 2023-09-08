import React, { useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

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
        <List>
          {localTransactions.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item.stockName} />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
          ))}
        </List>
      </div>
  );
}

export default ListWithRemove;
