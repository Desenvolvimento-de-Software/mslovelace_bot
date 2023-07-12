/**
 * Ada Lovelace Telegram Bot
 *
 * This file is part of Ada Lovelace Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  mslovelace_bot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import fetch from "node-fetch";

export default class TelegramBotApi {

    /**
     * Telegram Bot API endpoint.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected static endpoint = "https://api.telegram.org";

    /**
     * Telegram Bot token.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected static token: string;

    /**
     * Telegram Bot API method.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected method: string;

    /**
     * Request payload.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected payload: any;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public constructor(method: string) {
        this.method = method;
    }

    /**
     * Returns the file URL.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param path
     *
     * @returns File URL.
     */
    public static getFileUrl(path: string): string {
        return `${TelegramBotApi.endpoint}/file/bot${TelegramBotApi.token}/${path}`;
    }

    /**
     * Sets the Telegram Bot token.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {string} token
     */
    public static setToken(token: string): void {
        TelegramBotApi.token = token;
    }

    /**
     * Makes a GET request to the Telegram Bot API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async get(): Promise<any> {
        return this.request("GET", this.payload);
    }

    /**
     * Makes a POST request to the Telegram Bot API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async post(): Promise<any> {
        return this.request("POST", this.payload);
    }

    /**
     * Makes a POST request to the Telegram Bot API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async put(): Promise<any> {
        return this.request("PUT", this.payload);
    }

    /**
     * Makes a POST request to the Telegram Bot API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async delete(): Promise<any> {
        return this.request("DELETE", this.payload);
    }

    /**
     * Makes the request to the Telegram Bot API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param method
     * @param payload
     *
     * @returns {Promise<any>}
     */
    private async request(method: string, payload: object): Promise<any> {

        if (payload) {
            payload = this.camelCaseToSnakeCase(payload);
            payload = { method: this.method, ...payload };
        }

        const url = `${TelegramBotApi.endpoint}/bot${TelegramBotApi.token}/${this.method}`;
        const body = JSON.stringify(payload) || "";

        const headers = {
            "Content-Type" : "application/json",
            "Content-Length" : body.length.toString()
        };

        const params: Record<string, any> = {
            method : method,
            headers : headers
        };

        if (["PUT", "POST"].includes(method)) {
            params.body = body;
        }

        return fetch(url, params)
            .then((response) => response.json())
            .then((json) => this.validateJsonResponse(json as Record<string, any>))
            .then((json) => this.snakeToCamelCase(json))
            .catch((error: any) => {
                console.error(error.toString());
            });
    }

    /**
     * Validates the json response.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     *
     * @param {Record<string, any>} response
     *
     * @return {Record<string, any>}
     */
    private validateJsonResponse(response: Record<string, any>): Record<string, any> {
        if (!response.result) {
            throw new Error(JSON.stringify(response));
        }

        return response;
    }

    /**
     * Converts the payload from snake_case to camelCase.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param payload
     *
     * @returns
     */
    private camelCaseToSnakeCase = (payload: Record<string, any>): Record<string, any> => {

        if (Array.isArray(payload)) {
            return payload.map(this.camelCaseToSnakeCase);
        }

        if (typeof payload !== "object" || payload === null) {
            return payload;
        }

        const keys = Object.keys(payload);
        const result = <Record<string, any>> {};

        for (const key of keys) {
            const snakeKey = key.replace(/([A-Z])/g, (_, letter) => "_" + letter.toLowerCase()).toLowerCase();
            result[snakeKey] = this.camelCaseToSnakeCase(payload[key]);
        }

        return result;
    };

    /**
     * Converts the payload from snake_case to camelCase.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param payload
     *
     * @returns
     */
    private snakeToCamelCase = (payload: Record<string, any>): Record<string, any> => {

        if (Array.isArray(payload)) {
            return payload.map(this.snakeToCamelCase);
        }

        if (typeof payload !== "object" || payload === null) {
            return payload;
        }

        const keys = Object.keys(payload);
        const result = <Record<string, any>> {};

        for (const key of keys) {
            const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            result[camelKey] = this.snakeToCamelCase(payload[key]);
        }

        return result;
    };
}
