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

import Command from "./Command.js";
import Context from "../library/telegram/context/Context.js";
import CommandContext from "../library/telegram/context/Command.js";
import { BotCommand } from "../library/telegram/type/BotCommand.js";
import ChatHelper from "../helper/Chat.js";
import ChatConfigs from "../model/ChatConfigs.js";
import ChatMessages from "../model/ChatMessages.js";
import Lang from "../helper/Lang.js";

export default class Captcha extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
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
    public constructor(context: Context) {
        super(context);
        this.setParams(["on", "off"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @param {CommandContext} command
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        this.context.message.delete();
        this.command = command;
        const params = command.getParams();

        let action = "index";
        if (params && params.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        const method = action as keyof typeof Captcha.prototype;
        await this[method](true as never);
    }

    /**
     * Activates the group captcha.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    private async on(): Promise<void> {

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language);
        const result = await this.updateCaptchaStatus(chat.id, 1);

        const captchaStatus = Lang.get("textEnabled");
        const captchaMessage = Lang.get("captchaStatus").replace("{status}", captchaStatus);

        if (result.affectedRows > 0) {
            this.context.chat.sendMessage(captchaMessage);
        }
    }

    /**
     * Deactivates the group captcha.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    private async off(): Promise<void> {

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language);
        const result = await this.updateCaptchaStatus(chat.id, 0);

        const captchaStatus = Lang.get("textDisabled");
        const captchaMessage = Lang.get("captchaStatus").replace("{status}", captchaStatus);

        if (result.affectedRows > 0) {
            this.context.chat.sendMessage(captchaMessage);
        }
    }

    /**
     * Updates the captcha status.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @param {number} chatId
     * @param {number} status
     */
    private async updateCaptchaStatus(chatId: number, status: number): Promise<any> {

        const update = new ChatConfigs();
        update
            .update()
            .set("captcha", status)
            .where("chat_id").equal(chatId);

        return update.execute();
    }
}
