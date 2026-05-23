const currencyFormatter = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
});

function formatMoney(value) {
    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
        return "රු. 0.00";
    }

    return `රු. ${currencyFormatter.format(numericValue)}`;
}

module.exports = {
    formatMoney
};
