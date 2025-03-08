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

import Context from "contexts/Context";
import CommandContext from "contexts/Command";
import Chat from "contexts/Chat";
import Lang from "helpers/Lang";
import User from "contexts/User";
import WarningsBase from "./Base";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { getChatByTelegramId } from "services/Chats";
import { getUserByTelegramId } from "services/Users";
import { addWarning, getUserWarnings } from "services/Warnings";

export default class Warn extends WarningsBase {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "warn", description: "Gives the user a warning." },
        { command: "delwarn", description: "Gives the user a warning and deletes their's message." }
    ];

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
     * @since  2022-09-12
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
     * @param {CommandContext} command
     * @param {Context}        context
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

        this.command = command;
        const chatContext = this.context.getChat();

        const chat = await getChatByTelegramId(chatContext!.getId());
        if (!chat) {
            return Promise.resolve();
        }

        const params = this.command.getParams();
        if (!params?.length) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        const replyToMessage = this.context.getMessage()?.getReplyToMessage();
        if (replyToMessage && command.getCommand() === "delwarn") {
            replyToMessage.delete();
        }

        const users: User[] = [];
        if (replyToMessage) {
            const user = replyToMessage.getUser();
            user && (users.push(user));
        }

        const mentions = await this.context.getMessage()?.getMentions() || [];
        for (const mention of mentions) {
            users.push(mention);
            params.shift();
        }

        if (!users.length) {
            return Promise.resolve();
        }

        for (let i = 0, length = users.length; i < length; i++) {
            const user = users[i];
            user && (await this.warn(user, chatContext!, params.join(" ")));
            user && (await this.checkBan(user, chatContext!));
        }

        users?.length && (this.sendWarningMessages(users, chatContext!));
    }

    /**
     * Saves the user warning.
     *
     * @author Marcos Leandro
     * @since  2023-06-14
     *
     * @param contextUser
     * @param chat
     * @param warningLimit
     * @param reason
     */
    private async warn(contextUser: User, chat: Chat, reason: string): Promise<void> {

        this.context?.getMessage()?.delete();

        if (contextUser.getId() === parseInt(process.env.TELEGRAM_USER_ID!)) {
            this.context?.getMessage()?.reply(Lang.get("selfWarnMessage"));
            return Promise.resolve();
        }

        if (await contextUser.isAdmin()) {
            this.context?.getMessage()?.reply(Lang.get("adminWarnMessage"));
            return Promise.resolve();
        }

        const user = await getUserByTelegramId(contextUser.getId());
        if (!user) {
            return Promise.resolve();
        }

        const reasonMessage = reason.length ? reason : Lang.get("reasonUnknown");
        await addWarning(contextUser, chat, reasonMessage);
    }

    /**
     * Bans the user if necessary.
     *
     * @author Marcos Leandro
     * @since  2023-06-14
     *
     * @param userContext
     * @param chatContext
     */
    private async checkBan(userContext: User, chatContext: Chat): Promise<void> {

        const chat = await getChatByTelegramId(chatContext.getId());
        const warnings = await getUserWarnings(userContext, chatContext);
        if (!chat || !warnings.length) {
            return Promise.resolve();
        }

        const warningLimit = chat.chat_configs?.warnings ?? 3;
        if (warnings.length < warningLimit) {
            return Promise.resolve();
        }

        userContext.ban();
    }
}
