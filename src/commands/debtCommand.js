const { formatDate } = require("../utils/dateFormatter");
const { formatMoney } = require("../utils/moneyFormatter");

async function executeDebtCommand(apiClient) {
    const debt = await apiClient.getOutstandingDebt();
    const customers = Array.isArray(debt.topOutstandingCustomers)
        ? debt.topOutstandingCustomers
        : [];

    const lines = [
        `Outstanding debt - ${formatDate(debt.asOfDate)}`,
        `Total due: ${formatMoney(debt.totalOutstandingAmount)}`,
        `Customers owing: ${debt.outstandingCustomerCount || 0}`,
        `Outstanding bills: ${debt.outstandingBillCount || 0}`,
        `Largest customer balance: ${formatMoney(debt.largestOutstandingAmount)}`,
        `Oldest bill: ${formatDate(debt.oldestOutstandingBillDate)}`,
        "",
        "Top customers:"
    ];

    if (customers.length === 0) {
        lines.push("None");
    } else {
        customers.forEach((customer, index) => {
            lines.push(`${index + 1}. ${customer.customerName}: ${formatMoney(customer.outstandingAmount)}`);
        });
    }

    return lines.join("\n");
}

module.exports = {
    executeDebtCommand
};
