const { formatDate } = require("../utils/dateFormatter");
const { formatMoney } = require("../utils/moneyFormatter");

function getDealerName(cheque) {
    return cheque.dealerName || cheque.customerName || "නම සඳහන් නොවේ";
}

function getChequeNumber(cheque) {
    return cheque.chequeNumber || "අංකය සඳහන් නොවේ";
}

function formatTodayChequeItems(cheques) {
    if (!Array.isArray(cheques) || cheques.length === 0) {
        return ["අද මුදල් කළ යුතු dealer cheque නොමැත."];
    }

    return cheques.slice(0, 5).map((cheque, index) => {
        return `${index + 1}. ${getDealerName(cheque)} - ${formatMoney(cheque.amount)} - ${getChequeNumber(cheque)}`;
    });
}

function formatWeekChequeItems(cheques) {
    if (!Array.isArray(cheques) || cheques.length === 0) {
        return ["ඉදිරි දින 7 තුළ මුදල් කළ යුතු dealer cheque නොමැත."];
    }

    return cheques.slice(0, 5).map((cheque, index) => {
        return `${index + 1}. ${getDealerName(cheque)} - ${formatMoney(cheque.amount)} - ${formatDate(cheque.dueDate)} - ${getChequeNumber(cheque)}`;
    });
}

function formatTodayCheques(response, includeHeading = true) {
    const lines = [];
    if (includeHeading) {
        lines.push(`අද මුදල් කළ යුතු dealer cheque - ${formatDate(response.date)}`, "");
    }

    lines.push(
        `ගණන: ${response.chequeCount || 0}`,
        `මුළු මුදල: ${formatMoney(response.totalChequeAmount)}`,
        "",
        ...formatTodayChequeItems(response.cheques)
    );

    return lines.join("\n");
}

function formatWeekCheques(response, includeHeading = true) {
    const lines = [];
    if (includeHeading) {
        lines.push("ඉදිරි දින 7 තුළ මුදල් කළ යුතු dealer cheque", "");
    }

    lines.push(
        `ගණන: ${response.chequeCount || 0}`,
        `මුළු මුදල: ${formatMoney(response.totalChequeAmount)}`,
        "",
        ...formatWeekChequeItems(response.cheques)
    );

    return lines.join("\n");
}

function formatCombinedCheques(todayResponse, weekResponse) {
    return [
        "Dealer Cheque සාරාංශය",
        "",
        "අද මුදල් කළ යුතු cheque:",
        formatTodayCheques(todayResponse, false),
        "",
        "ඉදිරි දින 7 තුළ මුදල් කළ යුතු cheque:",
        formatWeekCheques(weekResponse, false)
    ].join("\n");
}

async function executeChequesCommand(apiClient) {
    const todayResponse = await apiClient.getChequesToday();
    const weekResponse = await apiClient.getChequesNextSevenDays();

    return formatCombinedCheques(todayResponse, weekResponse);
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
