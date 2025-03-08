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
import Context from "contexts/Context";
import CommandContext from "contexts/Command";
import { BotCommand } from "libraries/telegram/types/BotCommand";

export default class SetCommands extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "send", description: "Sends a message as the bot." }
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
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context.getUser()?.isAdmin()) {
            return;
        }

        const currentCommand = command.getCommand();

        let text = this.context.getMessage()?.getText() ?? "";
        text = text.replace(`/${currentCommand}`, "").trim();

        this.context.getMessage()?.delete();

        const options = { parse_mode : "HTML" };
        const replyToMessage = this.context.getMessage()?.getReplyToMessage();
        if (replyToMessage) {
            replyToMessage.reply(text, options);
            return Promise.resolve();
        }

        this.context.getChat()?.sendMessage(text, options);
    }
}
