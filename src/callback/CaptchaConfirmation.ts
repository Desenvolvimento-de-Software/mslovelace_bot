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

import Callback from "./Callback";
import ChatHelper from "helper/Chat";
import ChatMessages from "model/ChatMessages";
import Context from "context/Context";
import Lang from "helper/Lang";
import RelUsersChats from "model/RelUsersChats";
import UserHelper from "helper/User";
import { ChatPermissions } from "library/telegram/type/ChatPermissions";

export default class CaptchaConfirmation extends Callback {

    /**
     * Chat row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private chat?: Record<string, any>;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
     public constructor(context: Context) {
        super(context);
        this.setCallbacks(["captchaconfirmation"]);
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
    public async run(): Promise<void> {

        const callbackQuery = this.context.getCallbackQuery();
        if (!callbackQuery?.callbackData) {
            return;
        }

        const userId = this.context.getUser()?.getId();
        const chatId = this.context.getChat()?.getId();
        if (!userId || !chatId) {
            return;
        }

        const user = await UserHelper.getByTelegramId(userId);
        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!user || !chat) {
            return;
        }

        this.chat = chat;
        Lang.set(chat.language || "en");

        if (this.context.getCallbackQuery()?.callbackData.d.userId !== this.context.getUser()?.getId()) {
            this.context.getCallbackQuery()?.answer(Lang.get("captchaNotSameUser"));
            return;
        }

        const relUsersChats = new RelUsersChats();
        relUsersChats
            .update()
            .set("checked", 1)
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        relUsersChats.execute();
        this.context.getMessage()?.delete();

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

        this.context.getCallbackQuery()?.answer(Lang.get("captchaConfirmed"));
        await this.context.getUser()?.setPermissions(permissions);

        if (chat.restrict_new_users) {
            this.restrictUser();
        }

        this.resendGreetings();
    }

    /**
     * Restricts the user, if applicable.
     *
     * @author Marcos Leandro
     * @since 2023-06-13
     */
    private async restrictUser(): Promise<void> {

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

        await this.context.getUser()?.setPermissions(permissions, 60 * 60 * 24);
    }

    /**
     * Resends the greetings without the captcha options.
     *
     * @author Marcos Leandro
     * @since  2025-01-03
     */
    private async resendGreetings(): Promise<void> {

        const chatMessagesRows = new ChatMessages();
        chatMessagesRows
            .select()
            .where("chat_id").equal(this.chat!.id)
            .offset(0)
            .limit(1);

        const chatMessages = await chatMessagesRows.execute();

        let text = Lang.get("defaultGreetings");
        if (chatMessages?.length) {
            text = chatMessages[0].greetings;
        }

        text = text.replace("{userid}", this.context.getUser()?.getId());
        text = text.replace(
            "{username}",
            this.context.getUser()?.getFirstName() ?? this.context.getUser()?.getUsername()
        );

        const message = await this.context.getChat()?.sendMessage(text, { parse_mode : "HTML" });

        setTimeout(() => {
            message.delete();
        }, 300000);
    }
}
