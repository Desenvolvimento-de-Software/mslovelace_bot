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

export default class Unban extends Command {

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

        if (!this.isAdmin(payload)) {
            this.warnUserAboutReporting(payload);
            return;
        }

        console.log(payload);
        console.log(payload.message.entities);
        let message = payload.message?.text || "";
        message = message.replace(/\/send\s?\/?/g, "");

        const chatId = payload.message.chat.id;
        const sendMessage = new SendMessage();

        sendMessage
            .setChatId(chatId)
            .setText(message)
            .post();
    }
}
