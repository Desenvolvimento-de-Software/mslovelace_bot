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
import SendMessage from "../../library/telegram/resource/SendMessage.js";
import UserHelper from "../../helper/User.js";
import ChatHelper from "../../helper/Chat.js";
import TextHelper from "../../helper/Text.js";
import Lang from "../../helper/Lang.js";

export default class NewChatMember extends Action {

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

        this.saveUserAndChat(payload.message.new_chat_member, payload.message.chat);

        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);

        if (!chat) {
            return;
        }

        if (chat.grouped_greetings) {
            return;
        }

        if (parseInt(chat.remove_event_messages) === 1) {
            this.deleteMessage(payload.message.message_id, payload.message.chat.id);
        }

        Lang.set(chat.language || "us");

        const user = await UserHelper.getUserByTelegramId(
            payload.message.new_chat_member.id
        );

        if (!user) {
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

        text = text.replace("{userid}", payload.message.new_chat_member.id);
        text = text.replace(
            "{username}",
            payload.message.new_chat_member.first_name || payload.message.new_chat_member.username
        );

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(payload.message.chat.id)
            .setText(text)
            .setParseMode("HTML")
            .post();

        this.setUserAsGreeted(user, chat);
    }

    /**
     * Saves the user as greeted in chat.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private async setUserAsGreeted(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

    }
}
