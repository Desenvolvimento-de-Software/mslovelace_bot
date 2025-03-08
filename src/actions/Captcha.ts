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

import Action from "actions/Action";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import RestrictChatMember from "libraries/telegram/resources/RestrictChatMember";
import { ChatPermissions } from "libraries/telegram/types/ChatPermissions";
import { getChatByTelegramId } from "services/Chats";
import { getUserByTelegramId, getUserAndChatByCaptcha } from "services/Users";
import { approveOnChat } from "services/UsersAndChats";

export default class Captcha extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context, "sync");
    }

    /**
     * Runs the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    public async run(): Promise<void> {

        if (this.context.getNewChatMember()) {
            return this.executeNewChatMember();
        }

        const text = this.context.getMessage()?.getText() ?? "";
        if (text.length === 6) {
            return this.resolveCaptcha(text);
        }
    }

    /**
     * Executes the new chat member routines.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     */
    private async executeNewChatMember(): Promise<void> {

        const userId = this.context.getNewChatMember()?.getId();
        const chatId = this.context.getChat()?.getId();
        if (!userId || !chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat?.chat_configs?.captcha) {
            return Promise.resolve();
        }

        const permissions: ChatPermissions = {
            can_send_messages: false,
            can_send_audios: false,
            can_send_documents: false,
            can_send_photos: false,
            can_send_videos: false,
            can_send_video_notes: false,
            can_send_voice_notes: false,
            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
            can_change_info: false,
            can_invite_users: false,
            can_pin_messages: false,
            can_manage_topics: false
        };

        this.context.getNewChatMember()?.setPermissions(permissions);
    }

    /**
     * Resolves the captcha.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param text
     */
    private async resolveCaptcha(text: string): Promise<void> {

        const userId = this.context.getUser()?.getId();
        if (!userId) {
            return Promise.resolve();
        }

        const user = await getUserByTelegramId(userId);
        if (!user) {
            return Promise.resolve();
        }

        try {

            const relUserChat = await getUserAndChatByCaptcha(text);
            if (!relUserChat) {
                return Promise.resolve();
            }

            await approveOnChat(relUserChat.id, relUserChat.id);
            await this.addPermissions(relUserChat.chats);

            if (relUserChat.chats.chat_configs?.restrict_new_users) {
                await this.restrictUser(relUserChat.chats);
            }

            this.sendConfirmationMessage(relUserChat.chats);

        } catch (err: any) {
            Log.save(err.message, err.stack);
            return Promise.resolve();
        }
    }

    /**
     * Adds the user's permissions.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param chat
     */
    private async addPermissions(chat: Record<string, any>): Promise<any> {

        const userId = this.context.getUser()?.getId();
        if (!userId) {
            return Promise.resolve();
        }

        const permissions: ChatPermissions = {
            can_send_messages: true,
            can_send_audios: true,
            can_send_documents: true,
            can_send_photos: true,
            can_send_videos: true,
            can_send_video_notes: true,
            can_send_voice_notes: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: true,
            can_invite_users: true,
            can_pin_messages: true,
            can_manage_topics: true
        };

        const restrictChatMember = new RestrictChatMember();
        return await restrictChatMember
            .setUserId(userId)
            .setChatId(Number(chat.chat_id))
            .setChatPermissions(permissions)
            .post();
    }

    /**
     * Restricts the user, if applicable.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param chat
     */
    private async restrictUser(chat: Record<string, any>): Promise<void> {

        const userId = this.context.getUser()?.getId();
        if (!userId) {
            return Promise.resolve();
        }

        const permissions: ChatPermissions = {
            can_send_messages: true,
            can_send_audios: false,
            can_send_documents: false,
            can_send_photos: false,
            can_send_videos: false,
            can_send_video_notes: false,
            can_send_voice_notes: false,
            can_send_polls: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
            can_invite_users: false
        };

        const until = Math.floor(Date.now() / 1000) + (60 * 60 * 24);
        const restrictChatMember = new RestrictChatMember();

        restrictChatMember
            .setUserId(userId)
            .setChatId(chat.chat_id)
            .setChatPermissions(permissions)
            .setUntilDate(until)
            .post();
    }

    /**
     * Sends the confirmation message.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param chat
     */
    private async sendConfirmationMessage(chat: Record<string, any>): Promise<void> {

        let message = Lang.get("captchaConfirmationMessage");
        message = message.replace("{groupid}", chat.chat_id);
        message = message.replace("{groupname}", chat.title);

        this.context.getChat()?.sendMessage(message, { parse_mode: "HTML" });
    }
}
