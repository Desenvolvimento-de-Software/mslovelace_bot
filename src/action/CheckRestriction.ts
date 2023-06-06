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

import App from "../App.js";
import Action from "./Action.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";

export default class CheckRestriction extends Action {

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

        const user = await UserHelper.getUserByTelegramId(
            payload.message.from.id
        );

        const chat = await ChatHelper.getChatByTelegramId(
            payload.message.chat.id
        );

        if (!user || !chat) {
            return;
        }

        if (parseInt(chat.restrict_new_users) === 0) {
            return;
        }

        const relUserChat = new RelUsersChats();
        relUserChat
            .select()
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .offset(0)
            .limit(1);

        const row = await relUserChat.execute();
        if (!row.length) {
            return;
        }

        if (parseInt(row[0].date) < (Date.now() / 1000) - 86400) {
            return;
        }

        this.deleteMessage(payload.message.message_id, payload.message.chat.id);
    }
}
