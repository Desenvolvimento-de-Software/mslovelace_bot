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
import Log from "helpers/Log";
import { getChatByTelegramId } from "services/Chats";

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

        try {

            if (await this.context.getUser()?.isAdmin()) {
                return;
            }

            const chatId = this.context.getChat()?.getId();
            if (!chatId) {
                throw new Error("Chat not found.");
            }

            const chat = await getChatByTelegramId(chatId);
            if (!chat) {
                throw new Error(`Chat ${chatId} not found.`);
            }

            if (this.context.getMessage()?.getReplyToMessage()) {
                return
            }

            const text = this.context.getMessage()?.getText();
            if (!text || text.length > 50) {
                return;
            }

            Lang.set(chat.language || "en");
            const regex = new RegExp(Lang.get("askToAskRegex"));
            if (!regex.exec(text)) {
                return;
            }

            this.context.getMessage()?.delete();

            const userId = this.context.getUser()?.getId();
            const username = this.context.getUser()?.getFirstName() ?? this.context.getUser()?.getUsername();
            const link = Lang.get("askToAskLink");
            const content = `<a href="tg://user?id=${userId}">${username}</a>,\n\n${link}`;

            this.context.getChat()?.sendMessage(content, { parse_mode : "HTML" });

        } catch (err: any) {
            Log.save(err.message, err.stack);
        }
    }
}
