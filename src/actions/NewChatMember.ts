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
import ChatHelper from "../helpers/Chat";
import Context from "contexts/Context";
import RelUsersChats from "../models/RelUsersChats";
import UserHelper from "../helpers/User";
import { Chat as Chatype } from "types/Chat";
import { User as UserType } from "models/type/User";
export default class NewChatMember extends Action {

    /**
     * User row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
    */
    private user?: UserType;

    /**
     * Chat row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private chat?: Chatype;

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

        if (!this.context.getNewChatMember()) {
            return Promise.resolve();
        }

        const userId = this.context.getNewChatMember()?.getId();
        if (!userId) {
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        this.user = await UserHelper.getByTelegramId(userId);
        this.chat = await ChatHelper.getByTelegramId(chatId);
        if (!this.user?.id || !this.chat?.id) {
            return Promise.resolve();
        }

        this.updateRelationship();
        if (this.chat.remove_event_messages === 1) {
            this.context.getMessage()?.delete();
        }
    }

    /**
     * Updates the relationship.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     * @returns
     */
    private async updateRelationship(): Promise<void> {

        if (!this.user?.id || !this.chat?.id) {
            return;
        }

        const timestamp = Math.floor(Date.now() / 1000);
        const timeout = this.chat?.captcha_ban_seconds ?? 60;
        const ttl = timestamp + timeout;

        const relUserChat = new RelUsersChats();
        relUserChat
            .update()
            .set("checked", Math.abs(this.chat?.captcha - 1))
            .set("date", timestamp)
            .set("ttl", ttl)
            .where("user_id").equal(this.user.id)
            .and("chat_id").equal(this.chat.id);

        await relUserChat.execute();
    }
}
