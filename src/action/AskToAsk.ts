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

import Action from "./Action";
import ChatHelper from "helper/Chat";
import Context from "context/Context";
import Lang from "helper/Lang";

export default class AskToAsk extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
     public async run(): Promise<void> {

        if (await this.context.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.warn_ask_to_ask) {
            return Promise.resolve();
        }

        if (this.context.getMessage()?.getReplyToMessage()) {
            return Promise.resolve();
        }

        const text = this.context.getMessage()?.getText();
        if (!text || text.length > 50) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");
        if (!text.match(Lang.get("askToAskRegex"))) {
            return Promise.resolve();
        }

        this.context.getMessage()?.delete();

        const userId = this.context.getUser()?.getId();
        const username = this.context.getUser()?.getFirstName() || this.context.getUser()?.getUsername();
        const link = Lang.get("askToAskLink");
        const content = `<a href="tg://user?id=${userId}">${username}</a>,\n\n${link}`;

        this.context.getChat()?.sendMessage(content, { parse_mode : "HTML" });

        return Promise.resolve();
    }
}
