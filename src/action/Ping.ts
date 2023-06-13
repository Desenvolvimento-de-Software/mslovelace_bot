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

import Action from "./Action.js";
import Context from "../library/telegram/context/Context.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";

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

        if (!this.context.message.getText().length) {
            return;
        }

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat) {
            return;
        }

        if (!await this.hasMention()) {
            return;
        }

        Lang.set(chat.language || "us");
        this.context.message.reply(Lang.get("pongMessage"));
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
        const mentions = await this.context.message.getMentions();

        for (const mention of mentions) {
            mentionUsernames.push(mention.getUsername());
        }

        return mentionUsernames.includes(process.env.TELEGRAM_USERNAME);
    }
}
