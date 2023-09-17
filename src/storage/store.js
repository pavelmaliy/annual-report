import {db} from './firebase'
import {collection, doc, getDocs, query, runTransaction, where} from "firebase/firestore"

export async function persistTransactions(stockTransactions, currency, exchange,user) {
    if (stockTransactions && stockTransactions.length > 0) {
        let colRef = collection(db, "transactions")
        try {
            await runTransaction(db, async (transaction) => {
               stockTransactions.map(item => {
                   transaction.set(doc(colRef), {...item, "user_id": user.uid, "currency":currency, "exchange": exchange})
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