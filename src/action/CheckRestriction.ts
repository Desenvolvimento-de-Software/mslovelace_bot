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
import Context from "src/library/telegram/context/Context.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";

export default class CheckRestriction extends Action {

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

        if (await UserHelper.isAdmin(this.context)) {
            return;
        }

        const user = await UserHelper.getUserByTelegramId(
            this.context.user.getId()
        );

        const chat = await ChatHelper.getChatByTelegramId(
            this.context.chat.getId()
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

        this.context.message.delete();
    }
}
