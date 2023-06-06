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
import RelUsersChats from "../model/RelUsersChats.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";

export default class LeftChatMember extends Action {

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

        const user = await UserHelper.getUserByTelegramId(payload.message.left_chat_member.id);
        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);

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

        this.deleteMessage(payload.message.message_id, payload.message.chat.id);
    }
 }
