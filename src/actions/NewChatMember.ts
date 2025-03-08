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
import Log from "helpers/Log";
import { getUserAndChatByTelegramId, join } from "services/UsersAndChats";
import { RelUserAndChat } from "types/UserAndChat";

export default class NewChatMember extends Action {

    /**
     * User and chat relationship object.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     *
     * @var RelUserAndChat
     */
    private userAndChat?: RelUserAndChat

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
        const chatId = this.context.getChat()?.getId();
        if (!userId || !chatId) {
            return Promise.resolve();
        }

        this.userAndChat = await getUserAndChatByTelegramId(userId, chatId) ?? undefined;
        if (!this.userAndChat?.users?.id || !this.userAndChat.chats?.id) {
            return Promise.resolve();
        }

        this.updateRelationship();
        if (this.userAndChat.chats.chat_configs?.remove_event_messages) {
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

        const timestamp = Math.floor(Date.now() / 1000);
        const timeout = this.userAndChat?.chats.chat_configs?.captcha_ban_seconds ?? 60;
        const ttl = this.userAndChat?.chats.chat_configs?.captcha ? timestamp + timeout : null;
        const checked = !this.userAndChat?.chats.chat_configs?.captcha;

        await join(this.userAndChat!.users.id, this.userAndChat!.chats.id, checked, ttl).catch((err) => {
            Log.save(err.message, err.stack);
        });
    }
}
