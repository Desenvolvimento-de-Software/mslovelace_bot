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
import Lang from "../helper/Lang.js";

export default class Ping extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-10-31
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
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
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     */
    public async run(command: CommandContext): Promise<void> {
        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        Lang.set(chat?.language || "us");
        this.context.message.reply(Lang.get("pongMessage"));
    }
}
