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
import RelUsersChats from "../model/RelUsersChats.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";

export default class LeftChatMember extends Action {

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

        if (!this.context.leftChatMember) {
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

        const relUserChat = new RelUsersChats();
        relUserChat
            .update()
            .set("joined", 0)
            .set("checked", 0)
            .where("user_id").equal(user.user_id)
            .and("chat_id").equal(chat.chat_id);

        relUserChat.execute();

        if (parseInt(chat.remove_event_messages) === 0) {
            return;
        }

        this.context.message.delete();
    }
 }
