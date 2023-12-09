import {db} from './firebase'
import {collection, doc, getDocs, deleteDoc, addDoc, query, runTransaction, where, Timestamp} from "firebase/firestore"

export async function persistTransactions(stockTransactions, user) {
    if (stockTransactions && stockTransactions.length > 0) {
        let colRef = collection(db, "transactions")
        try {
            await runTransaction(db, async (transaction) => {
               stockTransactions.map(item => {
                   transaction.set(doc(colRef), {...item, "originalQuantity": item.quantity, "transactionDate": Timestamp.fromMillis(item.transactionDate),"user_id": user.uid})
               })
            });
        } catch (e) {
            throw e
        }
    }
}

export async function saveReport(report, user) {
    let colRef = collection(db, "reports")
    try {
        await addDoc(colRef, {"report": report, "user_id": user.uid})
    } catch (e) {
        throw e 
    }
}

export async function updateTransactions(stockTransactions) {
    if (stockTransactions && stockTransactions.length > 0) {
        let colRef = collection(db, "transactions")
        try {
            await runTransaction(db, async (transaction) => {
               stockTransactions.map(item => { 
                   transaction.update(doc(colRef, item.id), item)
               })
            });
        } catch (e) {
            throw e
        }
    }
}

export async function getUserTransactions(user) {
    const q = query(collection(db, "transactions"), where("user_id", "==", user.uid));
    try {
        const docs = await getDocs(q);
        return docs.docs
    } catch (e) {
        console.error(e)
    }
    return []
}

export async function deleteTransaction(id) {
    const colRef = collection(db, "transactions")
    const docRef = doc(colRef, id) 
    try {
        await deleteDoc(docRef)
    } catch(e) {
        throw e
    }
	
}