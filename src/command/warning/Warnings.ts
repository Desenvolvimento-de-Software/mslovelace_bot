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

import ChatHelper from "helper/Chat";
import CommandContext from "context/Command";
import Context from "context/Context";
import User from "context/User";
import WarningsBase from "./Base";
import { BotCommand } from "library/telegram/type/BotCommand";

export default class Warnings extends WarningsBase {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "warnings", description: "Lists the user's warnings." },
        { command: "warns", description: "Lists the user's warnings (alternative)." }
    ];

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2023-06-14
     *
     * @var {CommandContext}
     */
    private readonly command?: CommandContext;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     */
    public constructor() {
        super();
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
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!this.context) {
            return Promise.resolve();
        }

        if (!await this.context.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        if (this.context.getChat()?.getType() === "private") {
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        const users: User[] = [];
        const replyToMessage = this.context.getMessage()?.getReplyToMessage();
        if (replyToMessage?.getUser()) {
            const user = replyToMessage.getUser();
            user && (users.push(user));
        }

        const mentions = await this.context.getMessage()?.getMentions() || [];
        for (const mention of mentions) {
            users.push(mention);
        }

        if (users.length) {
            this.sendWarningMessages(users, chat);
        }
    }
}
