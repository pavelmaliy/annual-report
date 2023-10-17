import { db } from "../storage/firebase";
import { collection, getDocs, addDoc, orderBy, query, limit } from "firebase/firestore";
import { parseDDMMYYYYDate, formatDateToDDMMYYYY } from "../utils/utils"

export const getExchangeRate = async function() {
    let rates = {}
    const exchangeQuery = query(collection(db, "eur_ils"));
    const latestRateQuery = query(collection(db, "eur_ils"), orderBy("date", "desc"), limit(1));

    try {
        const latestDocs = await getDocs(latestRateQuery);
        let lastCurrencyDate = latestDocs.docs[0].data().date.toDate()
        if (lastCurrencyDate < new Date()) {
            await updateRates(lastCurrencyDate)
        }

        const docs = await getDocs(exchangeQuery);
        docs.docs.map((item) => {
            rates[formatDateToDDMMYYYY(item.data().date.toMillis())] = parseFloat(item.data().rate)
        })
    } catch (e) {
        console.error(e)
    }

    return rates
}

async function updateRates(lastCurrencyDate) {
    let missingDate = new Date(lastCurrencyDate)
    let now = new Date()

    while (missingDate <= now) {
        missingDate.setDate(missingDate.getDate() + 1)
        try {
            let rate = await retrieveRateFromAPI(missingDate)
            await addDoc(collection(db, "eur_ils"), {
                "date": missingDate,
                "rate": rate.toString()
            });
        } catch (e) {
            console.error(e)
        }
    }
}

async function retrieveRateFromAPI(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const dateParam = `${year}-${month}-${day}`


    const url = `http://api.exchangerate.host/convert?access_key=d9eee996255ffd8af0fa11ed015229a1&from=EUR&to=ILS&amount=1&date=${dateParam}`;

    // Use the fetch() method to make a GET request to the URL
    const response = await fetch(url);

    // Check if the response status is OK (200)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Process the JSON data
    return data.result;
}

export const getRateByDate = function (dateString, rates) {
    if (rates[dateString]) {
        return rates[dateString]
    }

    let rate = null
    let date = parseDDMMYYYYDate(dateString)
    while (!rate) {
        date.setDate(date.getDate() - 1)
        rate = rates[formatDateToDDMMYYYY(date.getTime())]
    }

    return rate
}