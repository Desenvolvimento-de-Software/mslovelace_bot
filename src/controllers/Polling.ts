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

import App from "../App";
import Controller from "./Controller";
import GetUpdates from "../libraries/telegram/resources/GetUpdates";
import Log from "../helpers/Log";

export default class Polling extends Controller {

    /**
     * Allowed updates.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     */
    private readonly allowedUpdates: string[] = [
        "message",
        "edited_message",
        "channel_post",
        "edited_channel_post",
        "business_connection",
        "business_message",
        "edited_business_message",
        "deleted_business_messages",
        "message_reaction",
        "message_reaction_count",
        "inline_query",
        "chosen_inline_result",
        "callback_query",
        "shipping_query",
        "pre_checkout_query",
        "purchased_paid_media",
        "poll",
        "poll_answer",
        "my_chat_member",
        "chat_member",
        "chat_join_request",
        "chat_boost",
        "removed_chat_boost"
    ];

    /**
     *
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     */
    public constructor(app: App) {
        super(app, "/incoming");
        this.init();
    }

    /**
     * Starts the polling.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     */
    private init(): void {
        const webhookActive = process.env.TELEGRAM_WEBHOOK_ACTIVE?.toLowerCase() === "true";
        const debug = process.env.DEBUG?.toLowerCase() === "true";
        (debug || !webhookActive) && this.initializeLongPolling();
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

        Log.info("Requesting updates" + (typeof offset !== "undefined" ? ` from ${offset}` : "") + "...");

        const request = new GetUpdates();
        request.setTimeout((process.env.TELEGRAM_POLLING_TIMEOUT ?? 60) as number);
        request.setAllowedUpdates(this.allowedUpdates);

        if (offset?.toString().length) {
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
