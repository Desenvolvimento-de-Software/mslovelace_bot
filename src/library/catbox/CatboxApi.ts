/**
 * Catbot Telegram Bot
 *
 * This file is part of Catbot Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  moe_catbot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import fetch from "node-fetch";
import { FormData } from "formdata-node";
import { FormDataEncoder } from "form-data-encoder";
import { Readable } from "stream"

export default abstract class CatboxApi {

    /**
     * Catbox.moe API endpoint.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected static endpoint = "https://catbox.moe";
    // protected static endpoint = "https://yggdrasill.com.br";

    /**
     * Catbox.moe API method.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected method: string;

    /**
     * Request FormData.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected formData: FormData;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public constructor(method: string) {
        this.formData = new FormData();
        this.method = method;
    }

    /**
     * Makes a GET request to the Catbox.moe API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async get(): Promise<any> {
        return this.request("GET");
    }

    /**
     * Makes a POST request to the Catbox.moe API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async post(): Promise<any> {
        return this.request("POST");
    }

    /**
     * Makes a POST request to the Catbox.moe API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async put(): Promise<any> {
        return this.request("PUT");
    }

    /**
     * Makes a POST request to the Catbox.moe API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Promise<any>}
     */
    public async delete(): Promise<any> {
        return this.request("DELETE");
    }

    /**
     * Makes the request to the Catbox.moe API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param method
     *
     * @returns {Promise<any>}
     */
    private async request(method: string): Promise<any> {

        const url = `${CatboxApi.endpoint}/${this.method}`;
        const encoder = new FormDataEncoder(this.formData);

        const params = {
            method: method,
            headers: encoder.headers,
            body: Readable.from(encoder)
        };

        const request = fetch(url, params);
        return request;
    }
}
