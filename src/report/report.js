import { formatDateToDDMMYYYY } from "../utils/utils"
import { getRateByDate, getExchangeRate } from "./exchange"

export const generateOptimizedReport = async function (sells, buys, earliestTimestamp) {
    try {
        let exchangeRate = await getExchangeRate(earliestTimestamp)
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
                        let buyId = findBestBuy(sellTr, buyByStock[stock], exchangeRate)
                        addBuyTransaction(report, stock, sellTr, buyByStock[stock][buyId], exchangeRate)
                    }
                    let formattedDate = formatDateToDDMMYYYY(sellTr.transactionDate.toMillis())
                    let rate = getRateByDate(formattedDate, exchangeRate)
                    report[stock][sellTr.id] = Object.assign({
                        "date": formattedDate,
                        "exchangeRate": rate,
                        "price": sellTr.price,
                        "quantity": sellTr.originalQuantity,
                        "total": sellTr.price * sellTr.originalQuantity * rate,
                        "marketCurrency": sellTr.marketCurrency
                    }, report[stock][sellTr.id])
                }
            }
        }
    } catch (e) {
        console.error(e)
    }

    return report
}

function addBuyTransaction(report, stockName, sellTr, bestBuy, exchangeRate) {
    if (!report[stockName]) {
        report[stockName] = {}
    }

    if (!report[stockName][sellTr.id]) {
        report[stockName][sellTr.id] = {            
            "purchases": []
        }
    }

    const formattedDate = formatDateToDDMMYYYY(bestBuy.transactionDate.toMillis())
    var buy = {
        "sourceTransaction": bestBuy.id,
        "exchangeRate": getRateByDate(formattedDate, exchangeRate),
        "price": bestBuy.price,
        "date": formattedDate
    }

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
            trByStock[tr.stockName].push(tr)
        } else {
            trByStock[tr.stockName][tr.id] = tr
        }
    }
    return trByStock
}

function findBestBuy(sell, buys, exchangeRate) {
    let tax = Number.MAX_VALUE
    let bestBuy = {}
    let sellRate = getRateByDate(formatDateToDDMMYYYY(sell.transactionDate.toMillis()), exchangeRate)

    for (let buyid in buys) {
        if (buys.hasOwnProperty(buyid)) {
            const buyTr = buys[buyid]
            if (buyTr.quantity === 0) {
                continue
            }
            if (buyTr.transactionDate <= sell.transactionDate) {
                let buyRate = getRateByDate(formatDateToDDMMYYYY(buyTr.transactionDate.toMillis()), exchangeRate)
                let adaptiveBuyPrice = (buyTr.price * buyRate) * (sellRate / buyRate)
                let newTax = (sell.price * sellRate) - adaptiveBuyPrice
                if ( newTax < tax) {
                    tax = newTax
                    bestBuy = buyTr
                }
            }
        }
    }
    return bestBuy.id
}
