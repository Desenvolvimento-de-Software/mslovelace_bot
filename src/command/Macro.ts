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
import ChatHelper from "../helper/Chat.js";
import Chats from "../model/Chats.js";
import Macros from "../model/Macros.js";

export default class Macro extends Command {

    /**
     * Current loaded chat.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     */
    private chat: Record<string, any> = {};

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

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat) {
            return;
        }

        this.chat = chat;

        const params = command.getParams();
        if (!Array.isArray(params)) {
            return;
        }

        let action = "index";
        if (params && params.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        const method = action as keyof typeof Macro.prototype;
        await this[method](params as never);
    }

    /**
     * Adds a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private add(params: string[]): void {

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
    private list(params: string[]) {
        this.context.message.reply(params.join(" "));
    }

    /**
     * Removes a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private remove(params: string[]) {

    }
}
