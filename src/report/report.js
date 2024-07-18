import { formatDateToDDMMYYYY } from "../utils/utils"
import { getRateByDate, getExchangeRate } from "./exchange"

export const generateOptimizedReport = async function (sells, buys, earliestTimestamp) {
    try {
        //let exchangeRate = await getExchangeRate(earliestTimestamp, "eur")
        const exchangeRates = {}
        var report = {}
        const sellByStock = groupTransactionsByStock(sells, true)
        const buyByStock = groupTransactionsByStock(buys, false)

        for (const stock in sellByStock) {
            if (sellByStock.hasOwnProperty(stock)) {
                let sellTransactions = sellByStock[stock]
                const markerCurr = (sellTransactions.length > 0) ? sellTransactions[0].marketCurrency.toLowerCase() : ''
                if (!exchangeRates[markerCurr]) {
                    exchangeRates[markerCurr] = await getExchangeRate(earliestTimestamp, markerCurr)
                }

                // order by date from low to high 
                sellTransactions.sort((t1, t2) => {
                    return t1.transactionDate.toMillis() - t2.transactionDate.toMillis()
                })

                let buys = buyByStock[stock]
                let sumBuys = 0
                let sumSells = 0
                Object.values(buys).forEach(value => {
                    sumBuys += value.quantity
                  });

                for (const sell of sellTransactions ) {
                    sumSells += sell.quantity
                } 
                
                if (sumBuys < sumSells) {
                    throw "Not enough buy transactions to cover all sells"
                }

                for (const sellTr of sellTransactions) {
                    while (sellTr.quantity > 0) {
                        let buyId = findBestBuy(sellTr, buyByStock[stock], exchangeRates[markerCurr])
                        let hasEnough =  validateEarliestSellHasBuys(sellTransactions, buyByStock[stock], buyId, sellTr)

                        
                        if (!hasEnough) {
                            for (const t of sellTransactions) {
                                if (t.quantity > 0) {
                                    console.log(`sell transaction ${formatDateToDDMMYYYY(t.transactionDate.toMillis())} has ${t.quantity}`)
                                }
                            }
                            
                            const buysArray = Object.entries(buyByStock[stock]);
                            for (const [, buy] of buysArray) {
                                if (buy.quantity > 0) {
                                    console.log(`buy transaction ${formatDateToDDMMYYYY(buy.transactionDate.toMillis())} has ${buy.quantity}`)
                                }
                            }
                            throw "Not enough buy transactions to cover all sells" 
                        }



                        addBuyTransaction(report, stock, sellTr, buyByStock[stock][buyId], exchangeRates[markerCurr])
                        //if (!buyId) {
                        //    throw "Not enough buy transactions to cover all sells"
                        //}
                    }
                    let formattedDate = formatDateToDDMMYYYY(sellTr.transactionDate.toMillis())
                    let rate = getRateByDate(formattedDate, exchangeRates[markerCurr])
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
        return toCSV(report)
    } catch (e) {
        throw (e)
    }
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

    if (!bestBuy) {
        return
    }

    const formattedDate = formatDateToDDMMYYYY(bestBuy.transactionDate.toMillis())
    var buy = {
        "sourceTransaction": bestBuy.id,
        "exchangeRate": getRateByDate(formattedDate, exchangeRate),
        "price": bestBuy.price,
        "date": formattedDate
    }

    if (sellTr.quantity <= bestBuy.quantity) {
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

    // need to sort buys by date desc in case of equity we prefer older binding
    const buysArray = Object.entries(buys);
    buysArray.sort(([, buyA], [, buyB]) => buyB.transactionDate.toDate() - buyA.transactionDate.toDate());
    const sortedBuyKeys = buysArray.map(([key]) => key);

    for (let buyid of sortedBuyKeys) {
        const buyTr = buys[buyid]
        if (buyTr.quantity === 0) {
            continue
        }
       
        if (buyTr.transactionDate <= sell.transactionDate) {            
            let buyRate = getRateByDate(formatDateToDDMMYYYY(buyTr.transactionDate.toMillis()), exchangeRate)
            const index = (sellRate / buyRate) < 1 ? 1 : (sellRate / buyRate)
            let adaptiveBuyPrice = (buyTr.price * buyRate) * index
            let newTax = (sell.price * sellRate) - adaptiveBuyPrice
            if (newTax < tax) {
                tax = newTax
                bestBuy = buyTr
            }
        }
    }
    return bestBuy && bestBuy.id
}

function validateEarliestSellHasBuys(sellTransactions, buysObject, buyId, sellTr) {
    let earliestTimestamp = Number.MAX_VALUE
    let earliestTransaction
    for (const tr of sellTransactions) {
        if (tr.transactionDate.toMillis() < earliestTimestamp) {
            earliestTimestamp = tr.transactionDate.toMillis()
            earliestTransaction = tr
        }
    }



    const buysArray = Object.entries(buysObject);
    let earliestBuysQuantity = 0
    for (const [id, buy] of buysArray) {
        if (buy.transactionDate > sellTr.transactionDate) {
            continue
        }
        if (id !== buyId) {
            earliestBuysQuantity += buy.quantity
        } else {
            earliestBuysQuantity += (sellTr.quantity >= buy.quantity) ? 0 : (buy.quantity - sellTr.quantity)
        }
    }

    if (earliestBuysQuantity < earliestTransaction.quantity) {
        console.log("boo")
    }

    return earliestBuysQuantity >= earliestTransaction.quantity

}

async function toCSV(jsonReport) {
    let data = [
        [
            'Stock',
            'Currency (Market/Local)',
            'Sell Stock Price',
            'Sell Quantity',
            'Sell Price',
            'Sell Date',
            'Sell Exchange Rate',
            'Sell Local Price',            
            'Buy Stock Price',
            'Buy Quantity',
            'Buy Price',
            'Buy Date',
            'Buy Exchange Rate',
            'Buy Local Price',
            'Index',
            'Buy Adapted Price',
            'Profit For Tax'
        ]
    ]
    let total = 0
    for (const stock in jsonReport) {
        if (jsonReport.hasOwnProperty(stock)) {
            for (const trID in jsonReport[stock]) {
                if (jsonReport[stock].hasOwnProperty(trID)) {
                    for (const buy of jsonReport[stock][trID].purchases) {
                        const sell = jsonReport[stock][trID]
                        const sellExchangeRate = sell.exchangeRate.toFixed(4)
                        const sellPrice = sell.price * buy.quantity
                        const localSellPrice = (sellPrice * sellExchangeRate).toFixed(4)

                        const buyExchangeRate = buy.exchangeRate.toFixed(4)
                        const buyPrice = buy.price * buy.quantity
                        const localBuyPrice = (buyPrice * buyExchangeRate).toFixed(4)

                        const index = (sellExchangeRate / buyExchangeRate) < 1 ? 1 : (sellExchangeRate / buyExchangeRate).toFixed(4)
                        const localAdaptedBuyPrice = (localBuyPrice * index).toFixed(4)
                        const profitForTax = (localSellPrice - localAdaptedBuyPrice).toFixed(4)
                        total += parseFloat(profitForTax)
                        data.push([
                            stock,
                            sell.marketCurrency.toUpperCase() + "/ILS",
                            sell.price.toFixed(4),
                            sell.quantity.toFixed(4),
                            sellPrice.toFixed(4),                            
                            sell.date,
                            sellExchangeRate,
                            localSellPrice,
                            buy.price.toFixed(4),
                            buy.quantity.toFixed(4),
                            buyPrice.toFixed(4),
                            buy.date,
                            buyExchangeRate,
                            localBuyPrice,
                            index,
                            localAdaptedBuyPrice,
                            profitForTax
                        ])
                    }
                }
            }
        }
        data.push(['TOTAL',,,,,,,,,,,,,,,,total.toFixed(4)])
    }

    let csvContent = '';

    for (const row of data) {
        csvContent += row.join(', ') + '\n';
    }

    return csvContent
}
