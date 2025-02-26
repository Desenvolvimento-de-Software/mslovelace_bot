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

import ChatConfigs from "model/ChatConfigs";
import ChatHelper from "helper/Chat";
import Command from "./Command";
import CommandContext from "context/Command";
import Context from "context/Context";
import Lang from "helper/Lang";
import { BotCommand } from "library/telegram/type/BotCommand";

export default class AdaShield extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "adashield", description: "Shows the AdaShield status. Manages it with [on | off]." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    public constructor() {
        super();
        this.setParams(["index", "on", "off"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context.getUser()?.isAdmin()) {
            Promise.resolve();
        }

        const params = command.getParams();

        let action = "index";
        if (params?.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        this.context.getMessage()?.delete();

        const method = action as keyof AdaShield;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }

        return Promise.resolve();
    }

    /**
     * Shows the AdaShield status.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param payload Telegram API payload.
     */
    public async index(): Promise<void> {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");
        const adaShieldStatus = Lang.get(chat.adashield === 1 ? "textEnabled" : "textDisabled");
        const adaShieldMessage = Lang.get("adaShieldStatus").replace("{status}", adaShieldStatus);

        this.context?.getChat()?.sendMessage(adaShieldMessage);
    }

    /**
     * Activates the AdaShield.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     */
    private async on(): Promise<void> {
        await this.change(1);
        this.index();
    }

    /**
     * Deactivates the AdaShield.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     */
    private async off(): Promise<void> {
        await this.change(0);
        this.index();
    }

    /**
     * Changes the AdaShield status.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @param {Number} status New AdaShield status.
     */
    public async change(status: number) {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        const update = new ChatConfigs();
        update
            .update()
            .set("adashield", status)
            .where("chat_id").equal(chat.id);

        await update.execute();
    }
}
