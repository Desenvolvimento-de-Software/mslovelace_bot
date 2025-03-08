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
import ContextFactory from "contexts/ContextFactory";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import SaveMessage from "./SaveMessage";
import { AdditionalData as AdditionalDataType } from "types/AdditionalData";
import { InlineKeyboardButton } from "libraries/telegram/types/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "libraries/telegram/types/InlineKeyboardMarkup";
import { Message as MessageType } from "libraries/telegram/types/Message";
import { Update as UpdateType } from "libraries/telegram/types/Update";
import { PrismaClient } from "@prisma/client";
import { getUserAndChatByTelegramId } from "services/UsersAndChats";
import { RelUserAndChat } from "types/UserAndChat";
import Log from "helpers/Log";

export default class Greetings extends Action {

    /**
     * User and chat data.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     */
    private userAndChat?: RelUserAndChat

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

        if (!this.context.getNewChatMember() || !this.context.getChat()) {
            return Promise.resolve();
        }

        this.userAndChat = await getUserAndChatByTelegramId(
            this.context.getNewChatMember()!.getId(),
            this.context.getChat()!.getId()
        ) ?? undefined;

        if (!this.userAndChat) {
            return Promise.resolve();
        }

        if (!this.userAndChat.chats.chat_configs?.greetings) {
            return Promise.resolve();
        }

        if (!this.userAndChat.joined) {
            return Promise.resolve();
        }

        Lang.set(this.userAndChat.chats.language || "en");
        this.greetings();
    }

    /**
     * Shows the welcome emssage.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     */
    private async greetings(): Promise<void> {

        const prisma = new PrismaClient();
        let text = await prisma.chat_messages.findFirst({
            where: {
                chat_id: this.userAndChat?.chats.id,
            }

        }).then((response) => {
            return response?.greetings?.length ? response.greetings : Lang.get("defaultGreetings");

        }).catch((err: Error) => {
            Log.save(err.toString());
            return Lang.get("defaultGreetings");

        }).finally(async () => {
            await prisma.$disconnect();
        });

        text = text.replace("{userid}", this.userAndChat!.users.user_id.toString());
        text = text.replace(
            "{username}", (
                this.userAndChat!.users.first_name ??
                this.userAndChat!.users.username ??
                this.userAndChat!.users.user_id.toString()
            )
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

        if (!this.userAndChat?.chats.chat_configs?.captcha) {
            return options;
        }

        const language = this.userAndChat.chats.language || "en";
        const username = process.env.TELEGRAM_USERNAME;
        const captchaButton: InlineKeyboardButton = {
            text : Lang.get("captchaButton"),
            url : `https://t.me/${username}?start=captcha_${this.userAndChat.chats.chat_id}_${language}`
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
        const timeout = timestamp + ((this.userAndChat?.chats.chat_configs?.captcha_ban_seconds ?? 60));

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
}
