import {db} from './firebase'
import {collection, doc, getDocs, query, runTransaction, where, Timestamp} from "firebase/firestore"

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