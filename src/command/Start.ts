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

import Command from "./Command";
import Context from "context/Context";
import CommandContext from "context/Command";
import { BotCommand } from "library/telegram/type/BotCommand";
import UserHelper from "helper/User";
import ChatHelper from "helper/Chat";
import Lang from "helper/Lang";
import RelUsersChats from "model/RelUsersChats";
import { InlineKeyboardButton } from "library/telegram/type/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "library/telegram/type/InlineKeyboardMarkup";
import Captcha from "helper/Captcha";

export default class Start extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     */
    public readonly commands: BotCommand[] = [
        { command: "start", description: "Starts the bot." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor() {
        super();
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        if (this.context?.getChat()?.getType() !== "private") {
            this.sendGroupMessage();
            return Promise.resolve();
        }

        const params = command.getParams() ?? [];
        if (!params.length) {
            this.sendStartMessage();
        }

        for (const param of params) {
            if (param.startsWith("captcha")) {
                this.sendCaptcha(param);
                return Promise.resolve();
            }
        }
    }

    /**
     * Sends the start message.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     */
    private async sendStartMessage(): Promise<void> {

        const helpButton: InlineKeyboardButton = {
            text: Lang.get("helpButton"),
            callback_data: "help"
        };

        const username = process.env.TELEGRAM_USERNAME;
        const groupAddButton: InlineKeyboardButton = {
            text : Lang.get("startButton"),
            url : `http://t.me/${username}?startgroup=botstart`
        };

        const markup: InlineKeyboardMarkup = {
            inline_keyboard : [[helpButton, groupAddButton]]
        };

        const options = { parse_mode : "HTML", replyMarkup: markup };
        this.context?.getChat()?.sendMessage(Lang.get("startMessage"), options);
    }

    /**
     * Sends the group message.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     */
    private async sendGroupMessage(): Promise<void> {
        const message = Lang.get("groupStartMessage")
            .replace("{userid}", this.context?.getUser()?.getId())
            .replace("{username}", this.context?.getUser()?.getFirstName() ?? this.context?.getUser()?.getUsername());

        return this.context?.getMessage()?.reply(message, { parse_mode : "HTML" });
    }

    /**
     * Send the captcha.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param param
     */
    private async sendCaptcha(param: string): Promise<void> {

        const params = param.split("_");
        const groupId = params[1] ?? null;
        const language = params[2] ?? "us";

        const userId = this.context?.getUser()?.getId();
        if (!userId || !groupId) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(userId);
        const chat = await ChatHelper.getByTelegramId(parseInt(groupId));
        if (!user?.id || !chat?.id) {
            return Promise.resolve();
        }

        const relUserChat = new RelUsersChats();
        relUserChat
            .select()
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .offset(0)
            .limit(1);

        const row = await relUserChat.execute();
        if (!row.length) {
            return Promise.resolve();
        }

        const code = this.generateCaptchaCode();
        relUserChat
            .update()
            .set("captcha", code)
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        relUserChat.execute();

        Lang.set(language);

        const captcha = await this.generateCaptcha(code);
        const fileBlob = new Blob([captcha], { type : "image/png" });

        const username = process.env.TELEGRAM_USERNAME;
        const captchaButton: InlineKeyboardButton = {
            text: Lang.get("captchaRegenerate"),
            url: `https://t.me/${username}?start=captcha_${chat.chat_id}_${language}`
        };

        const markup: InlineKeyboardMarkup = {
            inline_keyboard: [[captchaButton]]
        };

        const options = {
            caption: Lang.get("captchaCaption"),
            parse_mode: "HTML",
            reply_markup: JSON.stringify(markup),
            protect_content: true
        };

        this.context?.getChat()?.sendPhoto(fileBlob, options);
    }

    /**
     * Generates the captcha.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param code
     *
     * @return {Buffer}
     */
    private async generateCaptcha(code: string): Promise<Buffer> {
        const captcha = Captcha.generate(code);
        return captcha;
    }

    /**
     * Generates a captcha code.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @returns {string}
     */
    private generateCaptchaCode(): string {

        const chars = "abcdefghjkmnpqrstuvwxyz23456789";
        let captcha = '';

        for (let i = 0; i < 6; i++) {
          captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return captcha;
    }
}
