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

    /**
     * For documentation, see http://localhost:8081/developers/documentation/api/#api-Check-PostCreateCheck
     * Returns the answer object with id, code and answerLink
     * @param {*} check 
     * @param {*} sendOptions 
     */
    createCheck(check, sendOptions) {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: this.options.endpoint + "/api/v1/portal/check",
                    headers: this.getHeaders(),
                    method: "POST",
                    json: true,
                    body: {
                        check: check,
                        sendOptions: sendOptions
                    }
                },
                (error, response, body) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    if (response.statusCode === 200) {
                        resolve(body);
                    } else {
                        reject(body);
                    }
                }
            )
        })
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

    getUser(userId) {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: this.options.endpoint + "/api/v1/portal/user/" + userId,
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
                        resolve(body.user);
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

    getFileMetadata(fileId) {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: this.options.endpoint + "/api/v1/portal/file/" + fileId,
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
                        resolve(body.file);
                    } else {
                        reject(body);
                    }
                }
            )
        });
    }

    reportError(message, stack, more) {
        return new Promise((resolve, reject) => {
            request(
                {
                    url: this.options.endpoint + "/api/v1/portal/notification/error/report",
                    headers: this.getHeaders(),
                    method: "POST",
                    json: true,
                    body: {
                        error: {
                            message,
                            stack,
                            more
                        }
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
        })
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
