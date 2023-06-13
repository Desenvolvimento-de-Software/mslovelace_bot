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
            return;
        }

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat?.id) {
            return;
        }

        if (chat.captcha !== 1) {
            return;
        }

        const permissions: ChatPermissions = {
            canSendMessages: false,
            canSendAudios: false,
            canSendDocuments: false,
            canSendPhotos: false,
            canSendVideos: false,
            canSendVideoNotes: false,
            canSendVoiceNotes: false,
            canSendPolls: false,
            canSendOtherMessages: false,
            canAddWebPagePreviews: false,
            canChangeInfo: false,
            canInviteUsers: false,
            canPinMessages: false,
            canManageTopics: false
        };

        this.context.newChatMember.setPermissions(permissions);
    }
}
