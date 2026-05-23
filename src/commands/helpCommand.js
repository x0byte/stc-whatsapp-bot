function executeHelpCommand() {
    return [
        "STC Dashboard commands:",
        "stat - today's cash summary",
        "debt - outstanding customer debt",
        "cheques - dealer cheques today and next 7 days",
        "cheques today - dealer cheques due today",
        "cheques week - dealer cheques due over the next 7 days",
        "help - show this command list"
    ].join("\n");
}

module.exports = {
    executeHelpCommand
};
