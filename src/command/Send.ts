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
import Context from "../library/telegram/context/Context";
import CommandContext from "../library/telegram/context/Command";

export default class Unban extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param {Context} context
     */
     public constructor(context: Context) {
        super(context);
        this.setCommands(["send"]);
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param payload
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        this.context.message.delete();

        const params = command.getParams();
        if (!params || !params.length) {
            return;
        }

        this.context.chat.sendMessage(params.join(" "));
    }
}
