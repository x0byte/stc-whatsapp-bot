const dotenv = require("dotenv");

dotenv.config();

function requireEnvironmentValue(name) {
    const value = process.env[name];
    if (!value || value.trim().length === 0) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value.trim();
}

function readOwnerNumbers() {
    const configuredNumbers = requireEnvironmentValue("OWNER_NUMBERS");
    const ownerNumbers = configuredNumbers
        .split(",")
        .map((number) => number.trim())
        .filter((number) => number.length > 0);

    if (ownerNumbers.length === 0) {
        throw new Error("OWNER_NUMBERS must contain at least one WhatsApp sender ID.");
    }

    return ownerNumbers;
}

function loadConfig() {
    const dashboardApiUrl = requireEnvironmentValue("DASHBOARD_API_URL").replace(/\/+$/, "");

    return {
        dashboardApiUrl,
        stcBotKey: requireEnvironmentValue("STC_BOT_KEY"),
        ownerNumbers: readOwnerNumbers(),
        sessionId: requireEnvironmentValue("SESSION_ID")
    };
}

module.exports = {
    loadConfig
};
