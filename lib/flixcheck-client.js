const request = require("request");

class FlixcheckClient {

    /**
     * Creates a new FlixcheckClient instance
     * @param {*} userId User's ID
     * @param {*} apiKey User's API key
     * @param {*} options more options (see doc)
     */
    constructor(userId, apiKey, options) {
        if (!userId || !apiKey) {
            throw new Error("userId or apiKey not provided");
        }
        this.userId = userId;
        this.apiKey = apiKey;
        this.options = {
            endpoint: "https://www.flixcheck.de"
        }
        if (options) {
            if (options.endpoint) {
                this.options.endpoint = options.endpoint;
            }
        }
    }

    getCheck(checkId) {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: this.options.endpoint + "/api/v1/portal/check/" + checkId,
                    headers: this.getHeaders(),
                    method: "GET",
                    json: true
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (response.statusCode === 200) {
                        resolve(body.check);
                    } else {
                        reject(body);
                    }
                }
            )
        })
    }

    putCheck(checkId, checkData) {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: this.options.endpoint + "/api/v1/portal/check/" + checkId,
                    headers: this.getHeaders(),
                    json: true,
                    method: "PUT",
                    body: {
                        check: checkData
                    }
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (response.statusCode === 200) {
                        resolve();
                    } else {
                        reject(body);
                    }
                }
            )
        });
    }

    getCheckPdf(checkId, options) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            const stream = request({
                url: this.options.endpoint + "/api/v1/portal/check/" + checkId + "/pdf",
                headers: this.getHeaders(),
                qs: {
                    bigPictures: options && options.bigPictures ? "true" : "false",
                    withEvents: options && options.withEvents ? "true" : "false",
                    withOtherPdfs: options && options.withOtherPdfs ? "true" : "false"
                }
            });
            stream.on("data", (c) => {
                chunks.push(new Buffer(c));
            });
            stream.on("end", () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    resolve(buffer);
                } catch (error) {
                    reject(error);
                }
            })
        });
    }

    getAccount(accountId) {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: this.options.endpoint + "/api/v1/portal/account/" + accountId,
                    headers: this.getHeaders(),
                    method: "GET",
                    json: true
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (response.statusCode === 200) {
                        resolve(body.account);
                    } else {
                        reject(body);
                    }
                }
            )
        });
    }

    getFile(fileId) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            const stream = request({
                url: this.options.endpoint + "/api/v1/portal/file/" + fileId + "/redirect",
                headers: this.getHeaders()
            });
            stream.on("data", (c) => {
                chunks.push(new Buffer(c));
            });
            stream.on("end", () => {
                try {
                    const buffer = Buffer.concat(chunks);
                    resolve(buffer);
                } catch (error) {
                    reject(error);
                }
            })
        });
    }

    getHeaders() {
        return {
            "X-Flixcheck-UserId": this.userId,
            "X-Flixcheck-ApiKey": this.apiKey,
            "Content-Type": "application/json"
        };
    }

}

module.exports = FlixcheckClient;
