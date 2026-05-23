const path = require("path");
const pino = require("pino");
const qrcode = require("qrcode-terminal");
const { executeChequesCommand, executeChequesTodayCommand, executeChequesWeekCommand } = require("./commands/chequesCommand");
const { executeDebtCommand } = require("./commands/debtCommand");
const { executeHelpCommand } = require("./commands/helpCommand");
const { executeSalesSummaryCommand } = require("./commands/salesSummaryCommand");
const { loadConfig } = require("./config");
const { StcApiClient, StcApiClientError } = require("./services/stcApiClient");
const { isAuthorizedOwner } = require("./utils/auth");

function normalizeCommand(messageText) {
    return String(messageText || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function extractMessageText(message) {
    if (!message || !message.message) {
        return "";
    }

    if (message.message.conversation) {
        return message.message.conversation;
    }

    if (message.message.extendedTextMessage && message.message.extendedTextMessage.text) {
        return message.message.extendedTextMessage.text;
    }

    return "";
}

async function buildReply(command, apiClient) {
    switch (command) {
        case "stat":
            return executeSalesSummaryCommand(apiClient);
        case "debt":
            return executeDebtCommand(apiClient);
        case "cheques":
            return executeChequesCommand(apiClient);
        case "cheques today":
            return executeChequesTodayCommand(apiClient);
        case "cheques week":
            return executeChequesWeekCommand(apiClient);
        case "help":
            return executeHelpCommand();
        default:
            return "එම විධානය හඳුනාගැනීමට බැරි වුණා.\nභාවිත කළ හැකි විධාන බලන්න help ලෙස එවන්න.";
    }
}

function apiErrorReply(error) {
    if (error instanceof StcApiClientError && error.code === "authorization") {
        return "Dashboard API අවසරය අසාර්ථකයි. Bot API key එක පරීක්ෂා කරන්න.";
    }

    if (error instanceof StcApiClientError && error.code === "unreachable") {
        return "STC dashboard එකට දැන් සම්බන්ධ වීමට බැහැ. කරුණාකර පසුව නැවත උත්සාහ කරන්න.";
    }

    return "STC dashboard ඉල්ලීම අසාර්ථකයි. කරුණාකර පසුව නැවත උත්සාහ කරන්න.";
}

function buildAuthFolder(sessionId) {
    const safeSessionId = sessionId.replace(/[^a-zA-Z0-9_-]/g, "_");
    return path.join(process.cwd(), `auth_${safeSessionId}`);
}

function createClientAdapter(sock) {
    return {
        sendText: async (to, text) => {
            await sock.sendMessage(to, { text });
        }
    };
}

async function handleMessage(message, clientAdapter, config, apiClient) {
    if (!message.key || message.key.fromMe) {
        return;
    }

    const senderId = message.key.remoteJid || "";
    const messageText = extractMessageText(message);
    console.log(`Incoming message sender=${senderId} text=${JSON.stringify(messageText)}`);

    if (!isAuthorizedOwner(senderId, config.ownerNumbers)) {
        console.log(`Ignoring message from unauthorized sender=${senderId}`);
        return;
    }

    const command = normalizeCommand(messageText);
    let reply;

    try {
        reply = await buildReply(command, apiClient);
    } catch (error) {
        console.error(`Dashboard request failed for command=${command}:`, error.message);
        reply = apiErrorReply(error);
    }

    try {
        await clientAdapter.sendText(senderId, reply);
    } catch (error) {
        console.error(`Could not send WhatsApp reply to sender=${senderId}:`, error.message);
    }
}

async function startBot(config, apiClient) {
    const {
        default: makeWASocket,
        DisconnectReason,
        useMultiFileAuthState
    } = await import("@whiskeysockets/baileys");

    const authFolder = buildAuthFolder(config.sessionId);
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: "silent" }),
        printQRInTerminal: false
    });
    const clientAdapter = createClientAdapter(sock);

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (event) => {
        if (!event || event.type !== "notify" || !Array.isArray(event.messages)) {
            return;
        }

        for (const message of event.messages) {
            await handleMessage(message, clientAdapter, config, apiClient);
        }
    });

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log("Scan this QR code from WhatsApp Linked devices:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log(`WhatsApp bot is connected. Session ID: ${config.sessionId}`);
        }

        if (connection === "close") {
            const statusCode = lastDisconnect
                && lastDisconnect.error
                && lastDisconnect.error.output
                ? lastDisconnect.error.output.statusCode
                : undefined;
            const isLoggedOut = statusCode === DisconnectReason.loggedOut;

            if (isLoggedOut) {
                console.error(`WhatsApp session logged out. Delete ${authFolder} and run npm start to link again.`);
                return;
            }

            console.log("WhatsApp connection closed. Reconnecting...");
            startBot(config, apiClient).catch((error) => {
                console.error("Unable to reconnect WhatsApp bot:", error.message);
            });
        }
    });
}

async function main() {
    const config = loadConfig();
    const apiClient = new StcApiClient(config);
    await startBot(config, apiClient);
}

main().catch((error) => {
    console.error("Unable to start WhatsApp bot:", error.message);
    process.exitCode = 1;
});
