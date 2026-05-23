function executeHelpCommand() {
    return [
        "STC WhatsApp Bot - විධාන",
        "",
        "",
        "stat",
        "අද දවසේ විකුණුම් සහ මුදල් සාරාංශය පෙන්වයි.",
        "",
        "debt",
        "දැනට ඇති මුළු ණය තත්ත්වය පෙන්වයි.",
        "",
        "cheques",
        "අද සහ ඉදිරි දින 7 තුළ මුදල් කළ යුතු dealer cheque සාරාංශය පෙන්වයි.",
        "",
        "cheques today",
        "අද මුදල් කළ යුතු dealer cheque පෙන්වයි.",
        "",
        "cheques week",
        "ඉදිරි දින 7 තුළ මුදල් කළ යුතු dealer cheque පෙන්වයි.",
        "",
        "help",
        "භාවිත කළ හැකි විධාන පෙන්වයි."
    ].join("\n");
}

module.exports = {
    executeHelpCommand
};
