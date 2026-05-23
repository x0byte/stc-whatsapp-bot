const { formatDate } = require("../utils/dateFormatter");
const { formatMoney } = require("../utils/moneyFormatter");

async function executeSalesSummaryCommand(apiClient) {
    const summary = await apiClient.getSalesSummaryToday();

    return [
        `STC අද දින මුදල් සාරාංශය - ${formatDate(summary.date)}`,
        "",
        "",
        `Cash විකුණුම්: ${formatMoney(summary.cashSales)}`,
        `ණයට කළ විකුණුම්: ${formatMoney(summary.creditSales)}`,
        `Cash නොවන විකුණුම්: ${formatMoney(summary.nonCashSales)}`,
        `ණය මුදල් ලැබීම්: ${formatMoney(summary.creditReceived)}`,
        "",
        `අද දින කඩයේ තැබිය යුතු Cash: ${formatMoney(summary.cashInShop)}`
    ].join("\n");
}

module.exports = {
    executeSalesSummaryCommand
};
