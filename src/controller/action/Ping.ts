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

import App from "../../App.js";
import Action from "../Action.js";
import ChatHelper from "../../helper/Chat.js";
import Lang from "../../helper/Lang.js";
import SendMessage from "../../library/telegram/resource/SendMessage.js";

export default class Ping extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-20
     *
     * @param app
     */
    public constructor(app: App) {
        super(app);
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  2022-09-20
     *
     * @param payload
     */
    public async run(payload: Record<string, any>): Promise<void> {

        if (typeof payload.message.text === "undefined" || !payload.message.text.length) {
            return;
        }

        if (!await this.isAdmin(payload)) {
            return;
        }

        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
        if (!chat) {
            return;
        }

        Lang.set(chat.language || "us");

        const text = payload.message.text;
        if (text.indexOf(process.env.TELEGRAM_USERNAME) === -1) {
            return;
        }

        const entities = payload.message.entities;
        if (!Array.isArray(entities)) {
            return;
        }

        let hasMention = false;
        for (let entity of entities) {

            let start = entity.offset || 0;
            let end = start + (entity.length || 0);
            if (entity.type === "mention" && text.substring(start, end) === process.env.TELEGRAM_USERNAME) {
                hasMention = true;
                break;
            }
        }

        if (hasMention) {
            const sendMessage = new SendMessage();
            sendMessage
                .setChatId(payload.message.chat.id)
                .setReplyToMessageId(payload.message.message_id)
                .setText(Lang.get("pongMessage"))
                .setParseMode("HTML")
                .post();
        }
    }
}
