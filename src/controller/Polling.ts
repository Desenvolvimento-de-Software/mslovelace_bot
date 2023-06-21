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

import App from "../App.js";
import Controller from "./Controller.js";
import GetUpdates from "../library/telegram/resource/GetUpdates.js";
import Log from "../helper/Log.js";

export default class Polling extends Controller {

    /**
     *
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     */
    public constructor(app: App) {
        super(app, "/incoming");
        if (process.env.TELEGRAM_WEBHOOK_ACTIVE?.toLowerCase() === "false") {
            this.initializeLongPolling();
        }
    }

    /**
     * Makes the long polling to the Telegram API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} offset
     */
    private async initializeLongPolling(offset?: number): Promise<void> {

        Log.info("Requesting updates" + (typeof offset !== "undefined" ? ` from ${offset}` : ""));

        const request = new GetUpdates();
        request.setTimeout((process.env.TELEGRAM_POLLING_TIMEOUT || 60) as number);

        if (typeof offset !== "undefined" && offset.toString().length) {
            request.setOffset(offset);
        }

        try {

            const response = await request.post();
            const json = await response.json();
            offset = this.parseResponse(json);

        } catch (err) {
            Log.error(err);
        }

        this.initializeLongPolling(offset ? ++offset : undefined);
    }

    /**
     * Parses the API response.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param response
     */
    private parseResponse(response: Record<string, any>): number|undefined {

        if (!response.ok) {
            Log.error(response.description);
            return;
        }

        if (!Array.isArray(response.result)) {
            return;
        }

        let offset;
        for (const update of response.result) {
            offset = update.update_id;
            this.handle(update);
        }

        return offset;
    }
}
