/**
 * Catbot Telegram Bot
 *
 * This file is part of Catbot Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  moe_catbot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import Command from "./Command.js";
import CommandContext from "../library/telegram/context/Command.js";
import Context from "../library/telegram/context/Context.js";

export default class Start extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 2023-07-10
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["start"]);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since 2023-07-10
     *
     * @param {CommandContext} command
     */
    public async run(command: CommandContext): Promise<void> {

        if (this.context.chat.getType() !== "private") {
            return;
        }

        this.context.chat.sendMessage(
            "Hello!\n\nYou can send me images, and I'll send it to catbox.moe giving you the link. (="
        );
    }
}
