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

import App from "../../App.js";
import Action from "../Action.js";
import ChatMessages from "../../model/ChatMessages.js";
import Shield from "../../model/Shield.js";
import SendMessage from "../../library/telegram/resource/SendMessage.js";
import UserHelper from "../../helper/User.js";
import ChatHelper from "../../helper/Chat.js";
import Lang from "../../helper/Lang.js";
import RestrictChatMember from "../../library/telegram/resource/RestrictChatMember.js";
import BanChatMember from "../../library/telegram/resource/BanChatMember.js";
import { ChatPermissionsType } from "../../library/telegram/type/ChatPermissions.js";

export default class NewChatMember extends Action {

    /**
     * Telegram payload.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     */
    private payload: Record<string,any> = {};

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public constructor(app: App) {
        super(app);
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
    public async run(payload: Record<string, any>): Promise<void> {

        this.payload = payload;
        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
        if (!chat) {
            return;
        }

        Lang.set(chat.language || "us");

        if (parseInt(chat.remove_event_messages) === 1) {
            this.deleteMessage(payload.message.message_id, payload.message.chat.id);
        }

        if (await this.shield()) {
            return;
        }

        this.saveUserAndChat(payload.message.new_chat_member, payload.message.chat);
        this.greetings(chat);

        const user = await UserHelper.getUserByTelegramId(
            payload.message.new_chat_member.id
        );

        if (!user) {
            return;
        }

        if (chat.restrict_new_users) {
            this.restrictUser(user, chat);
        }
    }

    /**
     * Executes the AdaShield to see if the user is a registered spammer.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     * @return
     */
    private async shield(): Promise<boolean> {

        const userId = this.payload.message.new_chat_member.id;
        const shield = new Shield();
        shield
            .select(["telegram_user_id"])
            .where("telegram_user_id")
            .equal(userId);

        const result = await shield.execute();
        if (!result.length) {
            return false;
        }

        const chatId = this.payload.message.chat.id;
        const ban = new BanChatMember();
        const response = await ban.setUserId(userId).setChatId(chatId).post();
        if (!response) {
            return false;
        }

        const message = Lang.get("adaShieldMessage")
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
    }

    /**
     * Shows the welcome emssage.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     * @param chat Chat object.
     */
    private async greetings(chat: Record<string, any>) {

        if (chat.grouped_greetings) {
            return;
        }

        if (parseInt(chat.greetings) === 0 || parseInt(chat.greetings) === NaN) {
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

        const response = await sendMessage.post();
        const json = await response.json();

        this.app.log(JSON.stringify(json));
        if (json.result?.message_id) {

            setTimeout(() => {
                const messageId = Number(json.result.message_id);
                const chatId = Number(this.payload.message.chat.id);
                this.deleteMessage(messageId, chatId);
            }, 600000); /* 10 minutes */
        }
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
    private async restrictUser(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

        const untilDate = Math.floor(Date.now() / 1000) + 86400;
        const chatPermissions: ChatPermissionsType = {
            can_send_messages         : true,
            can_send_media_messages   : false,
            can_send_polls            : false,
            can_send_other_messages   : false,
            can_add_web_page_previews : false,
            can_change_info           : false,
            can_invite_users          : false,
            can_pin_messages          : false
        };

        const restrictChatMember = new RestrictChatMember();
        restrictChatMember
            .setUserId(user.user_id)
            .setChatId(chat.chat_id)
            .setChatPermissions(chatPermissions)
            .setUntilDate(untilDate)
            .post();
    }
}
