export const generateOptimizedReport = function (sells, buys) {
    var report = {}
    const sellByStock = groupTransactionsByStock(sells)
    const buyByStock = groupTransactionsByStock(buys)


    for (const stock in sellByStock) {
        if (sellByStock.hasOwnProperty(stock)) {
            for (const tid in sellByStock[stock]) {
                if (sellByStock[stock].hasOwnProperty(tid)) {
                    let sellTr = sellByStock[stock][tid]
                    while (sellTr.quantity > 0) {
                        let buyId = findBestBuy(sellTr, buyByStock[stock])
                        addBuyTransaction(report, stock, sellTr, buyByStock[stock][buyId])
                    }
                }
            }
        }
    }

    return report
}

function groupTransactionsByStock(transactions) {
    let trByStock = {}
    for (const tr of transactions) {
        if (!trByStock[tr.stockName]) {
            trByStock[tr.stockName] = {};
        }
        trByStock[tr.stockName][tr.id] = {...tr, "originalQuantity": tr.quantity}
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
                if (buyTr.price - sell.price < tax) {
                    tax = buyTr.price - sell.price
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

    var buy = {...bestBuy}
    if (sellTr.quantity < bestBuy.quantity) {
        buy.quantity = sellTr.quantity
        bestBuy.quantity -= sellTr.quantity
        sellTr.quantity = 0        
    } else {
        buy.quantity = bestBuy.quantity
        sellTr.quantity -= bestBuy.quantity
        bestBuy.quantity = 0

    }


    report[stockName][sellTr.id].purchases.push({buy})
}