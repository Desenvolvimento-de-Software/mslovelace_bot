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
import CommandContext from "../library/telegram/context/Command.js";
import BotCommand from "../library/telegram/type/BotCommand.js";

export default abstract class Command {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {Context}
     */
    protected context: Context;

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [];

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
     *
     * @param {Context} context
     */
    public constructor(context: Context) {
        this.context = context;
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    public async run(command: CommandContext): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Returns the commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @return {Record<string, string>}
     */
    public getCommands(): Record<string, string> {
        return this.commands;
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
    public static isCalled(commandClass: Command, context: Context): CommandContext|undefined {

        if (typeof commandClass.commands === "undefined") {
            return;
        }

        const commandList: string[] = [];
        commandClass.commands.map((command) => commandList.push(command.command));

        for (const command of context.message.getCommands()) {
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
