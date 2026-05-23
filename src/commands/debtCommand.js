const { formatDate } = require("../utils/dateFormatter");
const { formatMoney } = require("../utils/moneyFormatter");

async function executeDebtCommand(apiClient) {
    const debt = await apiClient.getOutstandingDebt();
    const customers = Array.isArray(debt.topOutstandingCustomers)
        ? debt.topOutstandingCustomers
        : [];

    const lines = [
        `දැනට ගෙවීමට ඉතිරිව ඇති ණය තත්ත්වය - ${formatDate(debt.asOfDate)}`,
        ""
    ];

    if (customers.length === 0) {
        lines.push("දැනට ගෙවීමට ඉතිරි ණය මුදල් නොමැත.");
        return lines.join("\n");
    }

    lines.push(
        `ගෙවීමට ඉතිරි බිල්පත් ගණන: ${debt.outstandingBillCount || 0}`,
        `ණය ඇති පාරිභෝගිකයන් ගණන: ${debt.outstandingCustomerCount || 0}`,
        `මුළු හිඟ මුදල: ${formatMoney(debt.totalOutstandingAmount)}`,
        `එක් පාරිභෝගිකයෙකුට ඇති වැඩිම හිඟ මුදල: ${formatMoney(debt.largestOutstandingAmount)}`,
        "",
        "වැඩිම හිඟ මුදල් ඇති පාරිභෝගිකයන්:"
    );

    customers.forEach((customer, index) => {
        lines.push(`${index + 1}. ${customer.customerName} - ${formatMoney(customer.outstandingAmount)}`);
    });

    return lines.join("\n");
}

module.exports = {
    executeDebtCommand
};
