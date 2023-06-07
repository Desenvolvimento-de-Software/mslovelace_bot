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
import Context from "src/library/telegram/context/Context";
import ChatMessages from "../model/ChatMessages";
import RelUsersChats from "../model/RelUsersChats";
import UserHelper from "../helper/User";
import ChatHelper from "../helper/Chat";
import Lang from "../helper/Lang";
import RestrictChatMember from "../library/telegram/resource/RestrictChatMember";
import UnbanChatMember from "../library/telegram/resource/UnbanChatMember";
import { ChatPermissions } from "../library/telegram/type/ChatPermissions";
import { InlineKeyboardButton } from "../library/telegram/type/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "../library/telegram/type/InlineKeyboardMarkup";

export default class NewChatMember extends Action {

    /**
     * User row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var Record<string, any>
     */
    private user?: Record<string, any>;

    /**
     * Chat row.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @var Record<string, any>
     */
    private chat?: Record<string, any>;

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

        if (!this.context.newChatMember) {
            return;
        }

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat?.id) {
            return;
        }

        if (parseInt(chat.remove_event_messages) === 1) {
            this.context.message.delete();
        }
    }

    // /**
    //  * Allow the user to post anything.
    //  *
    //  * @author Marcos Leandro
    //  * @since  2022-09-16
    //  *
    //  * @param user
    //  * @param chat
    //  *
    //  * @return void
    //  */
    //  public async allowUser(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

    //     const chatPermissions: ChatPermissions = {
    //         canSendMessages : true,
    //         canSendPolls : true,
    //         canSendOtherMessages : true,
    //         canAddWebPagePreviews : true,
    //         canChangeInfo : true,
    //         canInviteUsers : true,
    //         canPinMessages : true
    //     };

    //     const restrictChatMember = new RestrictChatMember();
    //     restrictChatMember
    //         .setUserId(user.user_id)
    //         .setChatId(chat.chat_id)
    //         .setChatPermissions(chatPermissions)
    //         .post();
    // }

    // /**
    //  * Restricts the user for the next 24 hours.
    //  *
    //  * @author Marcos Leandro
    //  * @since  1.0.0
    //  *
    //  * @param user
    //  * @param chat
    //  *
    //  * @return void
    //  */
    // public async restrictUser(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

    //     const untilDate = Math.floor(Date.now() / 1000) + 86400;
    //     const chatPermissions: ChatPermissions = {
    //         canSendMessages : true,
    //         canSendPolls : false,
    //         canSendOtherMessages : false,
    //         canAddWebPagePreviews : false,
    //         canChangeInfo : false,
    //         canInviteUsers : false,
    //         canPinMessages : false
    //     };

    //     const restrictChatMember = new RestrictChatMember();
    //     restrictChatMember
    //         .setUserId(user.user_id)
    //         .setChatId(chat.chat_id)
    //         .setChatPermissions(chatPermissions)
    //         .setUntilDate(untilDate)
    //         .post();
    // }

    // /**
    //  * Executes the AdaShield and CAS verifications.
    //  *
    //  * @author Marcos Leandro
    //  * @since  2022-09-12
    //  *
    //  * @returns shield status.
    //  */
    // private async shield(): Promise<boolean> {

    //     const userId = this.context.newChatMember!.getId();

    //     if (!await this.adaShield(userId) && !await this.cas(userId)) {
    //         return false;
    //     }

    //     this.context.newChatMember!.ban();

    //     const username = (
    //         this.context.newChatMember!.getFirstName() ||
    //         this.context.newChatMember!.getUsername()
    //     );

    //     const lang = Lang.get(this.banMessage)
    //         .replace("{userid}", userId)
    //         .replace("{username}", username);

    //     this.context.chat.sendMessage(lang);
    //     return true;
    // }

    // /**
    //  * Executes the captcha routins.
    //  *
    //  * @author Marcos Leandro
    //  * @since  2022-09-16
    //  *
    //  * @param user
    //  * @param chat
    //  */
    // private async captcha(): Promise<void> {

    //     const chatPermissions: ChatPermissions = {
    //         canSendMessages : false,
    //         canSendPolls : false,
    //         canSendOtherMessages : false,
    //         canAddWebPagePreviews : false,
    //         canChangeInfo : false,
    //         canInviteUsers : false,
    //         canPinMessages : false
    //     };

    //     const restrictChatMember = new RestrictChatMember();
    //     restrictChatMember
    //         .setUserId(user.user_id)
    //         .setChatId(chat.chat_id)
    //         .setChatPermissions(chatPermissions)
    //         .post();
    // }
}
