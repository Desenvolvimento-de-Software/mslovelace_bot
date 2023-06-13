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
import {RequestType} from "./type/RequestType.js";

export default class CasApi {

    /**
     * Telegram Bot API endpoint.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    protected endpoint = "https://api.cas.chat";

    /**
     * Telegram Bot API method.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    protected method: string;

    /**
     * Request payload.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    protected payload: any;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    public constructor(method: string) {
        this.method = method;
    }

    /**
     * Makes a GET request to the Telegram Bot API.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
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
     * @since  2022-09-12
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
     * @since  2022-09-12
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
     * @since  2022-09-12
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
     * @since  2022-09-12
     *
     * @param method
     * @param payload
     *
     * @returns {Promise<any>}
     */
    private async request(method: string, payload: object): Promise<any> {

        const url  = `${this.endpoint}/${this.method}`;
        const body = JSON.stringify(payload) || "";

        const headers = {
            "Content-Type"   : "application/json",
            "Content-Length" : body.length.toString()
        };

        const params: RequestType = {
            method : method,
            headers : headers
        };

        if (["PUT", "POST"].includes(method)) {
            params.body = body;
        }

        return fetch(url, params);
    }
}
