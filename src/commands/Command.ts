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

import CommandContext from "contexts/Command";
import Context from "contexts/Context";
import { BotCommand } from "libraries/telegram/types/BotCommand";

export default abstract class Command {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {Context}
     */
    protected context: Context|undefined;

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [];

    /**
     * Params list.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {string[]}
     */
    private params: string[] = [];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    public constructor() {
        this.params = [];
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
        throw new Error("Method not implemented.");
    }

    /**
     * Defines the params list.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @param params
     */
    public setParams(params: string[]): void {
        this.params = params;
    }

    /**
     * Returns whether the command is valid.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param commandClass
     * @param context
     */
    public isCalled(context: Context): CommandContext|undefined {

        if (typeof this.commands === "undefined") {
            return;
        }

        let commandList: string[] = [];
        this.commands.forEach(command => {
            commandList.push(command.command);
            commandList.push(`${command.command}@${process.env.TELEGRAM_USERNAME}`);
        });

        const commands = context.getMessage()?.getCommands() ?? [];
        for (const command of commands) {
            if (commandList.includes(command.getCommand())) {
                return command;
            }
        }
    }

    /**
     * Returns whether the param is registered or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @param param
     *
     * @returns {Boolean}
     */
    protected isRegisteredParam(param: string): boolean {
        return this.params.includes(param);
    }
}
