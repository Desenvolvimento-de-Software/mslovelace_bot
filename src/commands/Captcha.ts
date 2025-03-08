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
import CommandContext from "contexts/Command";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { getChatByTelegramId } from "services/Chats";
import { PrismaClient } from "@prisma/client";

export default class Captcha extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "captcha", description: "Manages the group captcha with [on | off]." }
    ];

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    private command?: CommandContext;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    public constructor() {
        super();
        this.setParams(["on", "off"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        this.context.getMessage()?.delete();
        this.command = command;
        const params = command.getParams();

        let action = "index";
        if (params?.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        const method = action as keyof Captcha;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }
    }

    /**
     * Activates the group captcha.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    private async on(): Promise<void> {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language ?? "en");

        const result = await this.updateCaptchaStatus(chat.id, true);
        const captchaStatus = Lang.get("textEnabled");
        const captchaMessage = Lang.get("captchaStatus").replace("{status}", captchaStatus);

        if (result) {
            this.context?.getChat()?.sendMessage(captchaMessage);
        }
    }

    /**
     * Deactivates the group captcha.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    private async off(): Promise<void> {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language);
        const result = await this.updateCaptchaStatus(chat.id, false);

        const captchaStatus = Lang.get("textDisabled");
        const captchaMessage = Lang.get("captchaStatus").replace("{status}", captchaStatus);

        if (result) {
            this.context?.getChat()?.sendMessage(captchaMessage);
        }
    }

    /**
     * Updates the captcha status.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @param {number} chatId
     * @param {boolean} status
     */
    private async updateCaptchaStatus(chatId: number, status: boolean): Promise<boolean> {

        const data: { captcha: boolean; greetings?: boolean } = { captcha: status };
        if (status) {
            data.greetings = true;
        }

        const prisma = new PrismaClient();
        return await prisma.chat_configs.update({
            where: { chat_id: chatId },
            data: data

        }).then(() => {
            return true;

        }).catch(async (err: Error) => {
            Log.save(err.message, err.stack);
            return false;

        }).finally(() => {
            prisma.$disconnect();
        });
    }
}
