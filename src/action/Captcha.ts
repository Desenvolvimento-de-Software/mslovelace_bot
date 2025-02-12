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

import Action from "../action/Action.js";
import Context from "../library/telegram/context/Context.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";
import RestrictChatMember from "../library/telegram/resource/RestrictChatMember.js";
import { ChatPermissions } from "../library/telegram/type/ChatPermissions.js";
import Lang from "src/helper/Lang.js";

export default class Captcha extends Action {

    /**
     * User object.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @var {Record<string, unknown>}
     */
    private user: Record<string, any> = {};

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @var {Record<string, unknown>}
     */
    private chat: Record<string, any> = {};

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

        if (this.context.newChatMember) {
            return this.executeNewChatMember();
        }

        const text = this.context.message.getText();
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

        const user = await UserHelper.getByTelegramId(this.context.newChatMember!.getId());
        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        if (!user?.id || !chat?.id) {
            return Promise.resolve();
        }

        this.user = user!;
        this.chat = chat!;

        if (parseInt(this.chat.captcha) !== 1) {
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

        this.context.newChatMember!.setPermissions(permissions);
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

        const user = await UserHelper.getByTelegramId(this.context.user.getId());
        if (!user) {
            return Promise.resolve();
        }

        const relUserChat = new RelUsersChats();
        relUserChat
            .select()
            .where("user_id").equal(user.id)
            .and("captcha").equal(text)
            .and("checked").equal(0)
            .offset(0)
            .limit(1);

        const row = await relUserChat.execute();
        if (!row.length) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getById(row[0].chat_id);
        if (!chat) {
            return Promise.resolve();
        }

        relUserChat
            .update()
            .set("checked", 1)
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        relUserChat.execute();

        await this.addPermissions(chat);
        if (chat.restrict_new_users) {
            await this.restrictUser(chat);
        }

        this.sendConfirmationMessage(chat);
    }

    /**
     * Adds the user's permissions.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param chat
     */
    private async addPermissions(chat: Record<string, any>): Promise<Record<string, any>> {

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
        return restrictChatMember
            .setUserId(this.context.user.getId())
            .setChatId(chat.chat_id)
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

        return restrictChatMember
            .setUserId(this.context.user.getId())
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

        this.context.chat.sendMessage(message, { parse_mode: "HTML" });
    }
}
