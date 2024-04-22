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

import Context from "../../library/telegram/context/Context.js";
import CommandContext from "../../library/telegram/context/Command.js";
import User from "../../library/telegram/context/User.js";
import WarningsBase from "./Base.js";
import ChatHelper from "../../helper/Chat.js";
import Lang from "../../helper/Lang.js";

export default class Warnings extends WarningsBase {

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2023-06-14
     *
     * @var {CommandContext}
     */
    private command?: CommandContext;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["warnings", "warns"]);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     *
     * @returns
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        if (this.context.chat.getType() === "private") {
            return;
        }

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat) {
            return;
        }

        const users = [];
        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            users.push(replyToMessage.getUser());
        }

        const mentions = await this.context.message.getMentions() || [];
        for (const mention of mentions) {
            users.push(mention);
        }

        this.sendWarningMessages(users, chat);
    }
}
