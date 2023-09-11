import { db } from './firebase'
import { doc, setDoc, getDoc, updateDoc, collection } from "firebase/firestore"

const path = "transactions";

export async function persistTransactions(transactions) {
    if (transactions && transactions.length > 0 ) {
        const docRef = doc(db, path, path)
        try {
            let docSnapshot = await getDoc(docRef)
            if (docSnapshot.exists()) {
                let storedTransactions = docSnapshot.data()
                let newTransactions = transactions
                if (storedTransactions.transactions) {
                    newTransactions = transactions.concat(storedTransactions.transactions)
                }
                await updateDoc(docRef, {"transactions": newTransactions})
            } else {
                await setDoc(docRef, {"transactions": transactions})
            }
        } catch (err) {
            throw err
        }
    }
}