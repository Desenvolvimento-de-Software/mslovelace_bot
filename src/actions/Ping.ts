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
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import { getChatByTelegramId } from "services/Chats";

export default class Ping extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-20
     *
     * @param app
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  2022-09-20
     */
    public async run(): Promise<void> {

        const message = this.context.getMessage();
        if (!message?.getText().length) {
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        if (!await this.hasMention()) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");
        message.reply(Lang.get("pongMessage"));
    }

    /**
     * Returns whether the message has a mention to the bot or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns
     */
    private async hasMention(): Promise<boolean> {

        const mentionUsernames = [];
        const mentions = await this.context.getMessage()?.getMentions() ?? [];

        for (const mention of mentions) {
            mentionUsernames.push(mention.getUsername());
        }

        return mentionUsernames.includes(process.env.TELEGRAM_USERNAME);
    }
}
