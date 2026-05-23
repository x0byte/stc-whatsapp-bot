const { formatDate } = require("../utils/dateFormatter");
const { formatMoney } = require("../utils/moneyFormatter");

function formatChequeItems(cheques) {
    if (!Array.isArray(cheques) || cheques.length === 0) {
        return ["None"];
    }

    return cheques.map((cheque, index) => {
        const dealerName = cheque.dealerName || cheque.customerName || "Unknown dealer";
        const chequeNumber = cheque.chequeNumber ? ` #${cheque.chequeNumber}` : "";
        return `${index + 1}. ${dealerName}${chequeNumber} - ${formatMoney(cheque.amount)} - ${formatDate(cheque.dueDate)}`;
    });
}

function formatTodayCheques(response) {
    return [
        `Dealer cheques due today - ${formatDate(response.date)}`,
        `Count: ${response.chequeCount || 0}`,
        `Total: ${formatMoney(response.totalChequeAmount)}`,
        ...formatChequeItems(response.cheques)
    ].join("\n");
}

function formatWeekCheques(response) {
    return [
        `Dealer cheques due ${formatDate(response.startDate)} to ${formatDate(response.endDate)}`,
        `Count: ${response.chequeCount || 0}`,
        `Total: ${formatMoney(response.totalChequeAmount)}`,
        ...formatChequeItems(response.cheques)
    ].join("\n");
}

async function executeChequesCommand(apiClient) {
    const todayResponse = await apiClient.getChequesToday();
    const weekResponse = await apiClient.getChequesNextSevenDays();

    return [
        formatTodayCheques(todayResponse),
        "",
        formatWeekCheques(weekResponse)
    ].join("\n");
}

async function executeChequesTodayCommand(apiClient) {
    const response = await apiClient.getChequesToday();
    return formatTodayCheques(response);
}

async function executeChequesWeekCommand(apiClient) {
    const response = await apiClient.getChequesNextSevenDays();
    return formatWeekCheques(response);
}

module.exports = {
    executeChequesCommand,
    executeChequesTodayCommand,
    executeChequesWeekCommand
};
