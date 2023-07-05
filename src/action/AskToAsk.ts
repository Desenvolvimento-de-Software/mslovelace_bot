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
import ChatHelper from "../helper/Chat.js";
import Context from "../library/telegram/context/Context.js";
import Lang from "../helper/Lang.js";

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

        if (await this.context.user.isAdmin()) {
            return;
        }

        const chat = await ChatHelper.getByTelegramId(
            this.context.chat.getId()
        );

        if (!chat?.warn_ask_to_ask) {
            return;
        }
        if (this.context.message.getReplyToMessage()) {
            return;
        }

        if (this.context.message.getText().length > 50) {
            return;
        }

        Lang.set(chat.language || "us");
        if (!this.context.message.getText().match(Lang.get("askToAskRegex"))) {
            return;
        }

        this.context.message.delete();

        const userId = this.context.user.getId();
        const username = this.context.user.getFirstName() || this.context.user.getUsername();
        const link = Lang.get("askToAskLink");
        const content = `<a href="tg://user?id=${userId}">${username}</a>,\n\n${link}`;

        this.context.chat.sendMessage(content);
    }
}
