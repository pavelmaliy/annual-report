import {db} from './firebase'
import {collection, doc, runTransaction} from "firebase/firestore"

export async function persistTransactions(stockTransactions, user) {
    if (stockTransactions && stockTransactions.length > 0) {
        let colRef = collection(db, "transactions")
        try {
            await runTransaction(db, async (transaction) => {
               stockTransactions.map(item => {
                   transaction.set(doc(colRef), {...item, "user_id": user.uid})
               })
            });
        } catch (e) {
            throw e
        }
    }
}