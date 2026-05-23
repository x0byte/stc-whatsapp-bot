const { formatDate } = require("../utils/dateFormatter");
const { formatMoney } = require("../utils/moneyFormatter");

async function executeSalesSummaryCommand(apiClient) {
    const summary = await apiClient.getSalesSummaryToday();

    return [
        `Today's cash summary - ${formatDate(summary.date)}`,
        `Cash sales: ${formatMoney(summary.cashSales)}`,
        `Credit sales: ${formatMoney(summary.creditSales)}`,
        `Non-cash sales: ${formatMoney(summary.nonCashSales)}`,
        `Credit received: ${formatMoney(summary.creditReceived)}`,
        `Cash in shop: ${formatMoney(summary.cashInShop)}`
    ].join("\n");
}

module.exports = {
    executeSalesSummaryCommand
};
