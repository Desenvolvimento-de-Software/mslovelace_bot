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

import Action from "./Action.js";
import Context from "src/library/telegram/context/Context.js";
import ChatMessages from "../model/ChatMessages.js";
import RelUsersChats from "../model/RelUsersChats.js";
import Shield from "../model/Shield.js";
import SendMessage from "../library/telegram/resource/SendMessage.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";
import RestrictChatMember from "../library/telegram/resource/RestrictChatMember.js";
import BanChatMember from "../library/telegram/resource/BanChatMember.js";
import UnbanChatMember from "../library/telegram/resource/UnbanChatMember.js";
import Check from "../library/combot/resource/Check.js";
import { ChatPermissions } from "../library/telegram/type/ChatPermissions.js";
import { InlineKeyboardButton } from "../library/telegram/type/InlineKeyboardButton.js";
import { InlineKeyboardMarkup } from "../library/telegram/type/InlineKeyboardMarkup.js";

export default class NewChatMember extends Action {

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

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat) {
            return;
        }

        if (parseInt(chat.remove_event_messages) === 1) {
            this.context.message.delete();
        }

        Lang.set(chat.language || "us");

        if (await this.shield()) {
            return;
        }

        const user = await UserHelper.getUserByTelegramId(this.context.user.getId());
        if (!user) {
            return;
        }

        if (parseInt(chat.greetings) === 1) {
            this.greetings();
        }

        if (chat.captcha) {
            this.captcha();
        }

        if (chat.restrict_new_users) {
            this.restrictUser(user, chat);
        }
    }

    /**
     * Allow the user to post anything.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     *
     * @param user
     * @param chat
     *
     * @return void
     */
     public async allowUser(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

        const chatPermissions: ChatPermissions = {
            canSendMessages : true,
            canSendPolls : true,
            canSendOtherMessages : true,
            canAddWebPagePreviews : true,
            canChangeInfo : true,
            canInviteUsers : true,
            canPinMessages : true
        };

        const restrictChatMember = new RestrictChatMember();
        restrictChatMember
            .setUserId(user.user_id)
            .setChatId(chat.chat_id)
            .setChatPermissions(chatPermissions)
            .post();
    }

    /**
     * Restricts the user for the next 24 hours.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param user
     * @param chat
     *
     * @return void
     */
    public async restrictUser(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

        const untilDate = Math.floor(Date.now() / 1000) + 86400;
        const chatPermissions: ChatPermissions = {
            canSendMessages : true,
            canSendPolls : false,
            canSendOtherMessages : false,
            canAddWebPagePreviews : false,
            canChangeInfo : false,
            canInviteUsers : false,
            canPinMessages : false
        };

        const restrictChatMember = new RestrictChatMember();
        restrictChatMember
            .setUserId(user.user_id)
            .setChatId(chat.chat_id)
            .setChatPermissions(chatPermissions)
            .setUntilDate(untilDate)
            .post();
    }

    /**
     * Executes the AdaShield and CAS verifications.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @returns shield status.
     */
    private async shield(): Promise<boolean> {

        const userId = this.payload.message.new_chat_member.id;

        try {

            let lang = "adaShieldMessage";
            if (!(await this.adaShield(userId))) {

                lang = "casMessage";

                if (!(await this.cas(userId))) {
                    return false;
                }
            }

            const chatId = this.payload.message.chat.id;
            const ban = new BanChatMember();
            const response = await ban.setUserId(userId).setChatId(chatId).post();
            if (!response) {
                return false;
            }

            const message = Lang.get(lang)
                .replace("{userid}", userId)
                .replace(
                    "{username}",
                    this.payload.message.new_chat_member.first_name || this.payload.message.new_chat_member.username
                );

            const sendMessage = new SendMessage();
            sendMessage
                .setChatId(chatId)
                .setText(message)
                .setParseMode("HTML")
                .post();

            return true;

        } catch (err: any) {
            this.app.log(err.toString());
        }

        return false;
    }

    /**
     * Executes the AdaShield to see if the user is a registered spammer.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     * @param userId
     *
     * @return
     */
    private async adaShield(userId: number): Promise<boolean> {

        try {

            const shield = new Shield();
            shield
                .select(["telegram_user_id"])
                .where("telegram_user_id")
                .equal(userId);

            const result = await shield.execute();
            if (!result.length) {
                return false;
            }

            return true;

        } catch (err: any) {
            this.app.log(err.toString());
        }

        return false;
    }

    /**
     * Executes the Combot Anti-SPAM (CAS) to see if the user is a registered spammer.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     * @param userId
     *
     * @return
     */
    private async cas(userId: number): Promise<boolean> {

        try {

            const casCheck = new Check(userId);
            const response = await casCheck.get();
            const json = await response.json();

            const result = (!!json?.ok) || false;
            if (!result) {
                return false;
            }

            const shield = new Shield();
            shield
                .insert()
                .set("telegram_user_id", userId)
                .set("date", Math.floor(Date.now() / 1000))
                .set("reason", "CAS");

            shield.execute();
            return true;

        } catch (err: any) {
            this.app.log(err.toString());
        }

        return false;
    }

    /**
     * Shows the welcome emssage.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     */
    private async greetings() {

        if (chat.grouped_greetings) {
            return;
        }

        let text = Lang.get("defaultGreetings");

        const chatMessages = new ChatMessages();
        chatMessages
            .select()
            .where("chat_id").equal(chat.id)
            .offset(0)
            .limit(1);

        const chatMessage = await chatMessages.execute();
        if (chatMessage.length) {
            text = chatMessage[0].greetings;
        }

        text = text.replace("{userid}", this.payload.message.new_chat_member.id);
        text = text.replace(
            "{username}",
            this.payload.message.new_chat_member.first_name || this.payload.message.new_chat_member.username
        );

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(this.payload.message.chat.id)
            .setText(text)
            .setParseMode("HTML");

        if (chat.captcha === 1) {

            const captchaButton: InlineKeyboardButton = {
                text: Lang.get("captchaButton"),
                callbackData: JSON.stringify({
                    callback : "captchaconfirmation",
                    data : {
                        userId : this.payload.message.newChatmember.id
                    }
                })
            };

            const markup: InlineKeyboardMarkup = {
                inlineKeyboard : [[captchaButton]]
            };

            sendMessage.setReplyMarkup(markup);
        }

        const response = await sendMessage.post();
        const json = await response.json();

        if (json.result?.message_id) {

            setTimeout(() => {

                const messageId = Number(json.result.message_id);
                const chatId = Number(this.payload.message.chat.id);
                this.deleteMessage(messageId, chatId);

                if (chat.captcha === 1) {
                    this.checkUserForKick(user, chat);
                }

            }, 300000); /* 5 minutes */
        }
    }

    /**
     * Executes the captcha routins.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     *
     * @param user
     * @param chat
     */
    private async captcha(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

        const chatPermissions: ChatPermissions = {
            canSendMessages : false,
            canSendPolls : false,
            canSendOtherMessages : false,
            canAddWebPagePreviews : false,
            canChangeInfo : false,
            canInviteUsers : false,
            canPinMessages : false
        };

        const restrictChatMember = new RestrictChatMember();
        restrictChatMember
            .setUserId(user.user_id)
            .setChatId(chat.chat_id)
            .setChatPermissions(chatPermissions)
            .post();
    }

    /**
     * Checks if the user checked the captcha. If not, them.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     *
     * @param user User object.
     * @param chat Chat object.
     */
    private async checkUserForKick(user: Record<string, any>, chat: Record<string, any>) {

        const relUsersChats = new RelUsersChats();
        relUsersChats
            .select(['checked'])
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        try {

            const rel = await relUsersChats.execute();
            if (!rel.length) {
                return;
            }

            if (Number(rel[0].checked) === 1) {
                return;
            }

            const kick = new UnbanChatMember();
            kick
                .setUserId(user.user_id)
                .setChatId(chat.chat_id)
                .post();

        } catch (err: any) {
            this.app.log(err.toString());
        }
    }
}
