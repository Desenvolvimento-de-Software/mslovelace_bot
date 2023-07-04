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

import ChatHelper from "../../helper/Chat.js";
import Command from "../Command.js";
import Context from "../../library/telegram/context/Context.js";
import CommandContext from "../../library/telegram/context/Command.js";
import Lang from "../../helper/Lang.js";
import UserHelper from "../../helper/User.js";

export default class Federation extends Command {

    /**
     * User object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected user?: Record<string, any>;

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected chat?: Record<string, any>;

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    protected command?: CommandContext;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param command
     */
    public async run(command: CommandContext): Promise<void> {

        this.user = await UserHelper.getByTelegramId(this.context.user.getId());
        this.chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        if (!this.user?.id || !this.chat?.id) {
            return;
        }

        Lang.set(this.chat!.language || "us");

        this.command = command;
        const action = this.command.getCommand().substring(1);
        this[action as keyof typeof Federation.prototype](true as never);
    }
}
