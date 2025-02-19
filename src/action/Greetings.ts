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
import Context from "context/Context";
import Lang from "helper/Lang";
import Message from "context/Message";
import RelUsersChats from "model/RelUsersChats";
import UserHelper from "helper/User";
import { InlineKeyboardButton } from "library/telegram/type/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "library/telegram/type/InlineKeyboardMarkup";

export default class Greetings extends Action {

    /**
     * User row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private user?: Record<string, any>;

    /**
     * Chat row.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private chat?: Record<string, any>;

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

        if (parseInt(this.chat.greetings) !== 1) {
            return Promise.resolve();
        }

        if (parseInt(this.chat.grouped_greetings) === 1) {
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

        this.chatConfigs = await chatConfigs.execute();

        const chatMessages = new ChatMessages();
        chatMessages
            .select()
            .where("chat_id").equal(this.chat.id)
            .offset(0)
            .limit(1);

        this.chatMessages = await chatMessages.execute();
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
        const timeout = ((this.chatConfigs?.[0]?.captcha_ban_seconds || 60) * 1000);

        setTimeout((message, user, chat, context) => {
            this.deleteMessage(message);
            if (parseInt(chat?.captcha) === 1) {
                this.checkUserForKick(user!, chat!, context);
            }

        }, timeout, message, this.user, this.chat, this.context);
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

        options.replyMarkup = markup;
        return options;
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

        const row = await relUserChat.execute();
        if (!row.length) {
            return false;
        }

        return parseInt(row[0].joined) === 1;
    }

    /**
     * Deletes the message.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param messageID
     */
    private readonly deleteMessage = async (message: Message) => {
        message.delete();
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
    private async checkUserForKick(user: Record<string, any>, chat: Record<string, any>, context: Record<string, any>) {

        const relUsersChats = new RelUsersChats();
        relUsersChats
            .select(['checked'])
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        const rel = await relUsersChats.execute();
        if (!rel.length) {
            return;
        }

        if (Number(rel[0].checked) === 1) {
            return;
        }

        context.user.kick();

        Lang.set(chat?.language || "en");

        let text = Lang.get("captchaNotConfirmed");
        text = text.replace("{userid}", context.newChatMember!.getId());
        text = text.replace(
            "{username}",
            context.newChatMember?.getFirstName() ?? context.newChatMember?.getUsername()
        );

        const chatConfigs = new ChatConfigs();
        chatConfigs
            .select()
            .where("chat_id").equal(chat.id)
            .offset(0)
            .limit(1);

        const chatConfig = await chatConfigs.execute();
        const message = await context.chat.sendMessage(text, { parse_mode : "HTML" });
        const timeout = ((chatConfig[0]?.captcha_ban_seconds || 300) * 1000);

        setTimeout(() => {
            message.delete();
        }, timeout);
    }
}
