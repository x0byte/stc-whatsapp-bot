function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const text = String(value);
    return text.length >= 10 ? text.substring(0, 10) : text;
}

module.exports = {
    formatDate
};
