const axios = require("axios");

class StcApiClientError extends Error {
    constructor(code, message) {
        super(message);
        this.name = "StcApiClientError";
        this.code = code;
    }
}

class StcApiClient {
    constructor(config) {
        this.httpClient = axios.create({
            baseURL: config.dashboardApiUrl,
            timeout: 10000,
            headers: {
                "X-STC-BOT-KEY": config.stcBotKey
            }
        });
    }

    async getSalesSummaryToday() {
        return this.get("/api/whatsapp/sales-summary/today");
    }

    async getOutstandingDebt() {
        return this.get("/api/whatsapp/debt/outstanding");
    }

    async getChequesToday() {
        return this.get("/api/whatsapp/cheques/today");
    }

    async getChequesNextSevenDays() {
        return this.get("/api/whatsapp/cheques/next-7-days");
    }

    async get(path) {
        try {
            const response = await this.httpClient.get(path);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                throw new StcApiClientError("authorization", "Dashboard authorization failed.");
            }

            if (axios.isAxiosError(error) && !error.response) {
                throw new StcApiClientError("unreachable", "Dashboard API is unreachable.");
            }

            throw new StcApiClientError("request_failed", "Dashboard API request failed.");
        }
    }
}

module.exports = {
    StcApiClient,
    StcApiClientError
};
