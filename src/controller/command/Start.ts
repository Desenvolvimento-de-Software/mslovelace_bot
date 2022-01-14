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
import Command from "../Command.js";
import SendMessage from "../../library/telegram/resource/SendMessage.js";
import ChatHelper from "../../helper/Chat.js";
import Lang from "../../helper/Lang.js";

export default class Start extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor(app: App) {
        super(app);
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param payload
     */
    public async index(payload: Record<string, any>): Promise<void> {

        const isAdmin = await this.isAdmin(payload);
        const chat    = await ChatHelper.getChatByTelegramId(payload.message.chat.id);

        Lang.set(chat.language || "us");

        if (payload.message.chat.type !== "private" && !isAdmin) {
            return;
        }

        if (payload.message.chat.type !== "private") {

            const message = Lang.get("groupStartMessage")
                .replace("{userid}", payload.message.from.id)
                .replace("{username}", payload.message.from.first_name || payload.message.from.username);

            const sendMessage  = new SendMessage();
            sendMessage
                .setChatId(payload.message.chat.id)
                .setText(message)
                .setParseMode("HTML")
                .post();

            return;
        }
    }
}
