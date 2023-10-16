import { parseDDMMYYYYDate, formatDateToDDMMYYYY } from "../utils/utils"
import { db } from "../storage/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export const generateOptimizedReport = async function (sells, buys) {
    let exchangeRate = await getExchangeRate()
    var report = {}
    const sellByStock = groupTransactionsByStock(sells, true)
    const buyByStock = groupTransactionsByStock(buys, false)

    for (const stock in sellByStock) {
        if (sellByStock.hasOwnProperty(stock)) {
            let sellTransactions = sellByStock[stock]
            sellTransactions.sort((a, b) => b.price - a.price)
            // order by price from high to low 
            for (const sellTr of sellTransactions) {
                while (sellTr.quantity > 0) {
                    let buyId = findBestBuy(sellTr, buyByStock[stock])
                    addBuyTransaction(report, stock, sellTr, buyByStock[stock][buyId])
                }
            }
        }
    }

    return optimizedReport(report, exchangeRate)
}

function groupTransactionsByStock(transactions, isArray) {
    let trByStock = {}
    for (const tr of transactions) {
        if (!trByStock[tr.stockName]) {
            if (isArray) {
                trByStock[tr.stockName] = [];
            } else {
                trByStock[tr.stockName] = {};
            }
        }
        if (isArray) {
            trByStock[tr.stockName].push({ ...tr, "originalQuantity": tr.quantity })
        } else {
            trByStock[tr.stockName][tr.id] = { ...tr, "originalQuantity": tr.quantity }
        }
    }
    return trByStock
}

function findBestBuy(sell, buys) {
    let tax = Number.MAX_VALUE
    let bestBuy = {}

    for (let buyid in buys) {
        if (buys.hasOwnProperty(buyid)) {
            const buyTr = buys[buyid]
            if (buyTr.quantity === 0) {
                continue
            }
            if (buyTr.transactionDate <= sell.transactionDate) {
                if (sell.price - buyTr.price < tax) {
                    tax = sell.price - buyTr.price
                    bestBuy = buyTr
                }
            }
        }
    }
    return bestBuy.id
}

function addBuyTransaction(report, stockName, sellTr, bestBuy) {
    if (!report[stockName]) {
        report[stockName] = {}
    }

    if (!report[stockName][sellTr.id]) {
        report[stockName][sellTr.id] = {
            "sell": sellTr,
            "purchases": []
        }
    }

    var buy = { ...bestBuy }
    if (sellTr.quantity < bestBuy.quantity) {
        buy.quantity = sellTr.quantity
        bestBuy.quantity -= sellTr.quantity
        sellTr.quantity = 0
    } else {
        buy.quantity = bestBuy.quantity
        sellTr.quantity -= bestBuy.quantity
        bestBuy.quantity = 0

    }


    report[stockName][sellTr.id].purchases.push(buy)
}

function optimizedReport(report, exchangeRate) {
    let optimizedReport = {}
    for (const stock in report) {
        if (report.hasOwnProperty(stock)) {
            for (const sellID in report[stock]) {
                if (!optimizedReport[stock]) {
                    optimizedReport[stock] = []
                }
                let sellDate = formatDateToDDMMYYYY(report[stock][sellID]["sell"].transactionDate.toMillis())
                let entry = {
                    "id": report[stock][sellID]["sell"].id,
                    "price": report[stock][sellID]["sell"].price,
                    "marketCurrency": report[stock][sellID]["sell"].marketCurrency,
                    "quantity": report[stock][sellID]["sell"].originalQuantity,
                    "transactionType": "Sell",
                    "date": sellDate,
                    "exchangeRate": getRateByDate(sellDate, exchangeRate),
                    "purchases": []
                }
                for (const buy of report[stock][sellID].purchases) {
                    let buyDate = formatDateToDDMMYYYY(buy.transactionDate.toMillis())
                    let p = {
                        "id": buy.id,
                        "price": buy.price,
                        "usedQuantity": buy.quantity,
                        "quantity": buy.originalQuantity,
                        "date": buyDate,
                        "exchangeRate": getRateByDate(buyDate, exchangeRate),
                    }
                    entry.purchases.push(p)
                }
                optimizedReport[stock].push(entry)
            }
        }
    }
    return optimizedReport
}

async function getExchangeRate() {
    let rates = {}
    let now = new Date()
    const exchangeQuery = query(collection(db, "eur_ils"));

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

function getRateByDate(dateString, rates) {
    if(rates[dateString]) {
        return rates[dateString]
    }

    let rate = null
    let date = parseDDMMYYYYDate(dateString)
    while(!rate) {
        date.setDate(date.getDate() - 1)
        rate = rates[formatDateToDDMMYYYY(date.getTime())]
    }
    
    return rate
}