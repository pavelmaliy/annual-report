import { db } from './firebase'
import { doc, setDoc, getDoc, updateDoc,collection } from "firebase/firestore"
export async function persistTransactions(transactions) {
    if (transactions && transactions.length > 0 ) {
        const collectionRef = collection(db, "transactions")
        const docRef = doc(db, "transactions", "transactions")
        try {
            let docSnapshot = await getDoc(docRef)
            if (docSnapshot.exists()) {
                let storedTransactions = docSnapshot.data()
                let newTransactions = transactions.concat(storedTransactions.transactions)
                await updateDoc(doc(collectionRef, "transactions"), {"transactions": newTransactions})
            } else {
                await setDoc(doc(collectionRef, "transactions"), {"transactions": transactions})
            }
        } catch (err) {
            throw err
        }
    }
}