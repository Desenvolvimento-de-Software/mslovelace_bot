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
import CommandContext from "contexts/Command";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import Message from "contexts/Message";
import UserContext from "contexts/User";
import { approveOnChat, getUserAndChatByTelegramId } from "services/UsersAndChats";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { User as UserType } from "../libraries/telegram/types/User";

export default class Approve extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "approve", description: "Approves an user in the chat. It lifts restrictions and captcha" },
    ];

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
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

        this.command = command;
        this.context = context;

        if (!await this.context.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        this.command = command;
        this.context.getMessage()?.delete();

        let params = command.getParams() || [];

        const replyToMessage = this.context.getMessage()?.getReplyToMessage();
        if (replyToMessage) {
            this.approveByReply(replyToMessage, params.join(" ").trim());
            return Promise.resolve();
        }

        const mentions = await this.context.getMessage()!.getMentions();
        params = params.filter((param) => !param.startsWith("@"));

        mentions.forEach(async (mention) => {
            await this.approveByMention(mention, params.join(" ").trim());
        });

        const userId = parseInt(params[0]);
        if (userId === Number(params[0])) {
            params.shift();
            this.approveByUserId(userId, params.join(" ").trim());
        }
    }

    /**
     * Approves an user by message reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async approveByReply(replyToMessage: Message, reason: string): Promise<void> {

        const userContext = replyToMessage.getUser();
        if (!userContext) {
            return Promise.resolve();
        }

        const userAndChat = await getUserAndChatByTelegramId(
            userContext.getId(), this.context?.getChat()?.getId()!
        );

        if (!userAndChat?.users || !userAndChat.chats) {
            return Promise.resolve();
        }

        try {

            await approveOnChat(userAndChat.users.id, userAndChat.chats.id);
            await userContext.unrestrict();
            await this.sendMessage(userContext);

        } catch (err: any) {
            Log.error(err.message, err.stack);
        }
    }

    /**
     * Approves an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async approveByMention(mention: UserContext, reason: string): Promise<void> {

        const userAndChat = await getUserAndChatByTelegramId(
            mention.getId(), this.context?.getChat()?.getId()!
        );

        if (!userAndChat?.users || !userAndChat.chats) {
            return Promise.resolve();
        }

        try {

            await approveOnChat(userAndChat.users.id, userAndChat.chats.id);
            await mention.unrestrict();
            await this.sendMessage(mention);

        } catch (err: any) {
            Log.error(err.message, err.stack);
        }
    }

    /**
     * Approves the user by Telegram ID.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param userId
     * @param reason
     */
    private async approveByUserId(userId: number, reason: string): Promise<void> {

        const chat = this.context?.getChat();
        if (!chat) {
            return Promise.resolve();
        }

        const userAndChat = await getUserAndChatByTelegramId(
            userId, this.context?.getChat()?.getId()!
        );

        if (!userAndChat?.users || !userAndChat.chats) {
            return Promise.resolve();
        }

        const userType: UserType = {
            id: userId,
            is_bot: userAndChat.users.is_bot,
            first_name: userAndChat.users?.first_name ?? "",
            last_name: userAndChat.users?.last_name ?? "",
            username: userAndChat.users?.username ?? userId.toString()
        };

        try {

            const userContext = new UserContext(userType, chat);
            await approveOnChat(userAndChat.users.id, userAndChat.chats.id);
            await userContext.unrestrict();
            await this.sendMessage(userContext);

        } catch (err: any) {
            Log.error(err.message, err.stack);
        }
    }

    /**
     * Sends the user approval message.
     *
     * @author Marcos Leandro
     * @since  2025-05-03
     *
     * @param userContext
     */
    private async sendMessage(userContext: UserContext): Promise<void> {

        const username = (
            userContext.getFirstName() ?? userContext.getUsername() ?? userContext.getId().toString()
        );

        const message = Lang.get("userApproved")
            .replace("{userid}", userContext.getId().toString())
            .replace("{username}", username);

        this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });
    }
}
