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

import Callback from "./Callback.js";
import Context from "../library/telegram/context/Context.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";
import { ChatPermissions } from "../library/telegram/type/ChatPermissions.js";

export default class CaptchaConfirmation extends Callback {

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

        if (this.context.callbackQuery?.callbackData.d.userId !== this.context.user.getId()) {
            return;
        }

        const user = await UserHelper.getByTelegramId(
            this.context.user.getId()
        );

        const chat = await ChatHelper.getByTelegramId(
            this.context.chat.getId()
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

        relUsersChats.execute();
        this.context.message.delete();

        const permissions: ChatPermissions = {
            canSendMessages: true,
            canSendAudios: true,
            canSendDocuments: true,
            canSendPhotos: true,
            canSendVideos: true,
            canSendVideoNotes: false,
            canSendVoiceNotes: false,
            canSendPolls: false,
            canSendOtherMessages: true,
            canAddWebPagePreviews: true,
            canChangeInfo: false,
            canInviteUsers: true,
            canPinMessages: false,
            canManageTopics: false
        };

        await this.context.user.setPermissions(permissions);

        if (chat.restrict_new_users) {
            this.restrictUser();
        }
    }

    /**
     * Restricts the user, if applicable.
     *
     * @author Marcos Leandro
     * @since 2023-06-13
     */
    private async restrictUser(): Promise<void> {

        const permissions: ChatPermissions = {
            canSendMessages: true,
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

        await this.context.user.setPermissions(permissions, 60 * 60 * 24);
    }
}
