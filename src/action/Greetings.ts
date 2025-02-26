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
import ChatConfigs from "model/ChatConfigs";
import ChatHelper from "helper/Chat";
import ChatMessages from "model/ChatMessages";
import ContextFactory from "context/ContextFactory";
import Context from "context/Context";
import Lang from "helper/Lang";
import RelUsersChats from "model/RelUsersChats";
import SaveMessage from "./SaveMessage";
import UserHelper from "helper/User";
import { AdditionalData as AdditionalDataType } from "type/AdditionalData";
import { Chat as ChatType } from "type/Chat";
import { ChatConfigs as ChatConfigsType } from "model/type/ChatConfigs";
import { ChatMessage as ChatMessageType } from "model/type/ChatMessage";
import { InlineKeyboardButton } from "library/telegram/type/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "library/telegram/type/InlineKeyboardMarkup";
import { Message as MessageType } from "library/telegram/type/Message";
import { RelUserChat } from "model/type/RelUserChat";
import { Update as UpdateType } from "library/telegram/type/Update";
import { User as UserType } from "model/type/User";

export default class Greetings extends Action {

    /**
     * User row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private user?: UserType;

    /**
     * Chat row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private chat?: ChatType;

    /**
     * Chat configs.
     *
     * @author Marcos Leandro
     * @since  2025-01-03
     */
    private chatConfigs?: Record<string, any>;

    /**
     * Chat messages.
     *
     * @author Marcos Leandro
     * @since  2025-01-03
     */
    private chatMessages?: Record<string, any>;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Runs the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns {Promise<void>}
     */
    public async run(): Promise<void> {

        if (this.context.getType() !== "chat_member") {
            return Promise.resolve();
        }

        if (!this.context.getNewChatMember()) {
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        this.chat = await ChatHelper.getByTelegramId(chatId);
        if (!this.chat?.id) {
            return Promise.resolve();
        }

        if (this.chat.greetings !== 1) {
            return Promise.resolve();
        }

        const userId = this.context.getNewChatMember()?.getId();
        if (!userId) {
            return Promise.resolve();
        }

        this.user = await UserHelper.getByTelegramId(userId);
        if (!await this.isUserJoined()) {
            return Promise.resolve();
        }

        Lang.set(this.chat.language || "en");

        const chatConfigs = new ChatConfigs();
        chatConfigs
            .select()
            .where("chat_id").equal(this.chat.id)
            .offset(0)
            .limit(1);

        this.chatConfigs = chatConfigs.execute<ChatConfigsType[]>();

        const chatMessages = new ChatMessages();
        chatMessages
            .select()
            .where("chat_id").equal(this.chat.id)
            .offset(0)
            .limit(1);

        this.chatMessages = await chatMessages.execute<ChatMessageType[]>();
        this.greetings();
    }

    /**
     * Shows the welcome emssage.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     */
    private async greetings(): Promise<void> {

        const newChatMember = this.context.getNewChatMember();
        if (!newChatMember) {
            return Promise.resolve();
        }

        let text = Lang.get("defaultGreetings");
        if (this.chatMessages?.length) {
            text = this.chatMessages[0].greetings;
        }

        text = text.replace("{userid}", newChatMember.getId());
        text = text.replace(
            "{username}",
            newChatMember.getFirstName() ?? newChatMember.getUsername()
        );

        let options: Record<string, any> = { parse_mode : "HTML" };
        options = this.addCaptchaOptions(options);

        const message = await this.context.getChat()?.sendMessage(text, options);
        const messagePayload = message.getPayload();
        this.insertMessage(messagePayload);
    }

    /**
     * Adds the captcha options, if applicable.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param options
     *
     * @returns {Record<string, any>}
     */
    private addCaptchaOptions(options: Record<string, any>): Record<string, any> {

        if (!this.chat?.captcha) {
            return options;
        }

        const language = this.chat.language || "en";
        const username = process.env.TELEGRAM_USERNAME;
        const captchaButton: InlineKeyboardButton = {
            text : Lang.get("captchaButton"),
            url : `https://t.me/${username}?start=captcha_${this.chat.chat_id}_${language}`
        };

        const markup: InlineKeyboardMarkup = {
            inline_keyboard : [[captchaButton]]
        };

        options.reply_markup = markup;
        return options;
    }

    /**
     * Inserts the message in the database.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param payload
     */
    private insertMessage(payload: MessageType): void {

        const update: UpdateType = {
            update_id: 0,
            message: payload
        };

        const timestamp = Math.floor(Date.now() / 1000);
        const timeout = timestamp + ((this.chatConfigs?.[0]?.captcha_ban_seconds || 60));

        const additionalData: AdditionalDataType = {
            ttl: timeout
        };

        const context = ContextFactory.create(update);
        if (!context) {
            return;
        }

        const saveMessage = new SaveMessage(context);
        saveMessage.run(additionalData);
    }

    /**
     * Returns id the user is joined in the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns {Promise<boolean>}
     */
    private async isUserJoined(): Promise<boolean> {

        const relUserChat = new RelUsersChats();
        relUserChat
            .select()
            .where("user_id").equal(this.user!.id)
            .and("chat_id").equal(this.chat!.id)
            .offset(0)
            .limit(1);

        const row = await relUserChat.execute<RelUserChat[]>();
        if (!row.length) {
            return false;
        }

        return row[0].joined === 1;
    }
}
