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
import ChatHelper from "helpers/Chat";
import Context from "contexts/Context";
import RelUsersChats from "models/RelUsersChats";
import UserHelper from "helpers/User";

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

        if (!this.context.getLeftChatMember()) {
            return Promise.resolve();
        }

        const userId = this.context.getLeftChatMember()?.getId();
        const chatId = this.context.getChat()?.getId();
        if (!userId || !chatId) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(userId);
        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!user || !chat) {
            return Promise.resolve();
        }

        const relUserChat = new RelUsersChats();
        relUserChat
            .update()
            .set("joined", 0)
            .set("checked", 0)
            .set("ttl", null)
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        relUserChat.execute();

        if (chat.remove_event_messages === 0) {
            return Promise.resolve();
        }

        this.context.getMessage()?.delete();
    }
 }
