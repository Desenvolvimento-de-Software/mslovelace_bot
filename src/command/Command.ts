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

import Context from "../library/telegram/context/Context";
import CommandContext from "../library/telegram/context/Command";

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
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    public async execute(command: CommandContext): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Defines the commands list.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     */
    public setCommands(commands: string[]): void {
        this.commands = commands;
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
}
