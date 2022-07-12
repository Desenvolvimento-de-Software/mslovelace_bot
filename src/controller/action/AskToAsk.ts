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

export default class AskToAsk extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
     public constructor(app: App) {
        super(app);
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
     public async run(payload: Record<string, any>): Promise<void> {

        if (await this.isAdmin(payload)) {
            return;
        }

        const chat = await ChatHelper.getChatByTelegramId(
            payload.message.chat.id
        );

        if (!chat.warn_ask_to_ask) {
            return;
        }

        if (payload.message.reply_to_message || payload.message.text.length > 40) {
            return;
        }

        Lang.set(chat.language || "us");
        if (!payload.message.text.match(Lang.get("askToAskRegex"))) {
            return;
        }

        this.deleteMessage(payload.message.message_id, payload.message.chat.id);

        const username = payload.message.from.first_name || payload.message.from.username;
        const link = Lang.get("askToAskLink");
        const content = `<a href="tg://user?id=${payload.message.from.id}">${username}</a>,\n\n${link}`;

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(payload.message.chat.id)
            .setText(content)
            .setParseMode("HTML")
            .post();
    }
}
