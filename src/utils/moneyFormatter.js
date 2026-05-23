const currencyFormatter = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function formatMoney(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return "Rs. 0.00";
    }

    return `Rs. ${currencyFormatter.format(numericValue)}`;
}

module.exports = {
    formatMoney
};
