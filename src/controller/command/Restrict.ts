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
import Chats from "../../model/Chats.js";
import ChatHelper from "../../helper/Chat.js";

export default class Restrict extends Command {

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

        const chatId = payload.message.chat.id;
        const chat   = await ChatHelper.getChatByTelegramId(chatId);

        if (!chatId || !chat) {
            return;
        }

        const chats = new Chats();
        chats
            .update()
            .set("restrict_new_users", 1)
            .where("id").equal(chat.id);

        try {
            chats.execute();

        } catch (err: any) {
            this.app.log(err.toString());
        }
    }
}
