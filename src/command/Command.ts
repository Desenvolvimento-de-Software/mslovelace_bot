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
     * @since  2023-06-07
     *
     * @var {string[]}
     */
    private commands: string[] = [];

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
     * @param command
     */
    public isCalled(): CommandContext|undefined {

        let isCalled = false;
        let currentCommand;

        for (const command of this.context.message.getCommands()) {
            isCalled = isCalled || this.commands.includes(command.getCommand());
            !isCalled || (currentCommand = command);
        }

        return currentCommand;
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

    /**
     * Defines the commands list.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     */
    protected setCommands(commands: string[]): void {
        for (const command of commands) {
            this.commands.push(command);
            this.commands.push(`${command}@${process.env.TELEGRAM_USERNAME}`);
        }
    }
}
