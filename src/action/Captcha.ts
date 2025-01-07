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
import ChatHelper from "../helper/Chat.js";
import { ChatPermissions } from "../library/telegram/type/ChatPermissions.js";

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

        if (!this.context.newChatMember) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat || !chat?.id) {
            return Promise.resolve();
        }

        if (chat.captcha !== 1) {
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

        this.context.newChatMember.setPermissions(permissions);
    }
}
