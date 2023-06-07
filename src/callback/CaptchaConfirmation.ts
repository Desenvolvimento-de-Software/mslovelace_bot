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

import App from "../App";
import Callback from "./Callback";
import RelUsersChats from "../model/RelUsersChats";
import UserHelper from "../helper/User";
import ChatHelper from "../helper/Chat";
import NewChatMember from "../action/NewChatMember";

export default class CaptchaConfirmation extends Callback {

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
     * @param data
     */
    public async run(payload: Record<string, any>, data: Record<string, any>): Promise<void> {

        if (payload.callback_query.from.id !== data.userId) {
            return;
        }

        const user = await UserHelper.getUserByTelegramId(
            payload.callback_query.from.id
        );

        const chat = await ChatHelper.getChatByTelegramId(
            payload.callback_query.message.chat.id
        );

        if (!user || !chat) {
            return;
        }

        const relUsersChats = new RelUsersChats();
        relUsersChats
            .update()
            .set("checked", 1)
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        try {

            relUsersChats.execute();
            this.deleteMessage(payload.callback_query.message.message_id, chat.chat_id);

            const newChatMember = new NewChatMember(this.app);
            await newChatMember.allowUser(user, chat);

            if (chat.restrict_new_users) {
                newChatMember.restrictUser(user, chat);
            }

        } catch (err: any) {
            this.app.log(err.toString());
        }
    }
}
