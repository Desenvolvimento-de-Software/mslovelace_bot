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

import Context from "../library/telegram/context/Context.js";
import Message from "../library/telegram/context/Message.js";
import Action from "./Action.js";
import Lang from "../helper/Lang.js";
import ChatHelper from "../helper/Chat.js";
import UserHelper from "../helper/User.js";
import RelUsersChats from "../model/RelUsersChats.js";
import ChatConfigs from "src/model/ChatConfigs.js";
import ChatMessages from "../model/ChatMessages.js";
import { InlineKeyboardButton } from "../library/telegram/type/InlineKeyboardButton.js";
import { InlineKeyboardMarkup } from "../library/telegram/type/InlineKeyboardMarkup.js";

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

        if (!this.context.newChatMember) {
            return;
        }

        this.chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!this.chat || !this.chat?.id) {
            return;
        }

        if (parseInt(this.chat.greetings) !== 1) {
            return;
        }

        if (parseInt(this.chat!.grouped_greetings) === 1) {
            return;
        }

        this.user = await UserHelper.getByTelegramId(this.context.user.getId());
        if (!await this.isUserJoined()) {
            return;
        }

        Lang.set(this.chat.language || "us");

        const chatConfigs = new ChatConfigs();
        chatConfigs
            .select()
            .where("chat_id").equal(this.chat!.id)
            .offset(0)
            .limit(1);

        this.chatConfigs = await chatConfigs.execute();

        const chatMessages = new ChatMessages();
        chatMessages
            .select()
            .where("chat_id").equal(this.chat!.id)
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
     *
     */
    private async greetings() {

        let text = Lang.get("defaultGreetings");
        if (this.chatMessages?.length) {
            text = this.chatMessages[0].greetings;
        }

        text = text.replace("{userid}", this.context.newChatMember!.getId());
        text = text.replace(
            "{username}",
            this.context.newChatMember?.getFirstName() || this.context.newChatMember?.getUsername()
        );

        let options: Record<string, any> = { parseMode : "HTML" };
        options = this.addCaptchaOptions(options);

        const message = await this.context.chat.sendMessage(text, options);
        const timeout = ((this.chatConfigs?.[0]?.captcha_ban_seconds || 300) * 1000);

        setTimeout(() => {
            this.deleteMessage(message);
        }, timeout);
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

        const captchaButton: InlineKeyboardButton = {
            text: Lang.get("captchaButton"),
            callbackData: JSON.stringify({
                c: "captchaconfirmation",
                d: {
                    userId: this.context.newChatMember!.getId()
                }
            })
        };

        const markup: InlineKeyboardMarkup = {
            inlineKeyboard: [[captchaButton]]
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
    private deleteMessage = (message: Message) => {

        message.delete();
        if (parseInt(this.chat!.captcha) === 1) {
            this.checkUserForKick();
        }
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
    private async checkUserForKick() {

        const relUsersChats = new RelUsersChats();
        relUsersChats
            .select(['checked'])
            .where("user_id").equal(this.user!.id)
            .and("chat_id").equal(this.chat!.id);

        const rel = await relUsersChats.execute();
        if (!rel.length) {
            return;
        }

        if (Number(rel[0].checked) === 1) {
            return;
        }

        this.context.user.kick();

        let text = Lang.get("captchaNotConfirmed");
        text = text.replace("{userid}", this.context.newChatMember!.getId());
        text = text.replace(
            "{username}",
            this.context.newChatMember?.getFirstName() || this.context.newChatMember?.getUsername()
        );

        this.context.chat.sendMessage(text, { parseMode : "HTML" });
    }
}
