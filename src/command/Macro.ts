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
import Message from "src/library/telegram/context/Message.js";
import CommandContext from "../library/telegram/context/Command.js";

export default class Macro extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["am", "rm", "lm"]);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    public async run(command: CommandContext): Promise<void> {

        this.context.message.delete();

        const methods = {
            am : this.add,
            lm : this.list
            rm : this.remove
        };

        if (!methods.hasOwnProperty(command.getCommand())) {
            return;
        }

        this.methods[command.getCommand()](command);
    }

    /**
     * Adds a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private add(command: CommandContext): void {

        const params = command.getParams() || [];
        if (!params.length || params.length < 2) {
            return;
        }


    }

    /**
     * Lists the macros.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private list(command: commandContext) {

    }

    /**
     * Removes a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private remove(command: CommandContext) {

    }
}
