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
import ChatHelper from "helper/Chat";
import Lang from "helper/Lang";

export default class Ping extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-10-31
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "ping", description: "Just pings Ada. It's the same as mention her." }
    ];

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2024-10-31
     */
    private command?: CommandContext;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    public constructor() {
        super();
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.command = command;
        this.context = context;

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);

        Lang.set(chat?.language || "en");
        this.context.getMessage()?.reply(Lang.get("pongMessage"));
    }
}
