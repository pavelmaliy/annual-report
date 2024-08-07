import { db } from "../storage/firebase";
import { collection, getDocs, addDoc, orderBy, query, where, limit } from "firebase/firestore";
import { parseDDMMYYYYDate, formatDateToDDMMYYYY } from "../utils/utils"

export const getExchangeRate = async function(earliestTimestamp, currency) {
    let rates = {}
    const lowercurr = currency.toLowerCase()
    const exchangeQuery = query(collection(db, `${lowercurr}_ils`), where('date', '>=', earliestTimestamp));

    try {
        
        const docs = await getDocs(exchangeQuery);
        docs.docs.map((item) => {
            rates[formatDateToDDMMYYYY(item.data().date.toMillis())] = parseFloat(item.data().rate)
        })
    } catch (e) {
        console.error(e)
    }

    return rates
}

async function retrieveRateFromAPI(date, currency) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 because months are zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const dateParam = `${year}-${month}-${day}`
    const accessKey = process.env.REACT_APP_exchangeKey

    const url = `http://api.exchangerate.host/convert?access_key=${accessKey}&from=${currency.toUpperCase()}&to=ILS&amount=1&date=${dateParam}`;

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
    if (!rates) {
        throw "No exchange rates provided"
    }

    if (rates[dateString]) {
        return rates[dateString]
    }

    let rate = null
    let date = parseDDMMYYYYDate(dateString)
    if (isNaN(date)) {
        throw "Invalid date"
    }
    while (!rate) {
        date.setDate(date.getDate() - 1)
        rate = rates[formatDateToDDMMYYYY(date.getTime())]
    }

    return rate
}