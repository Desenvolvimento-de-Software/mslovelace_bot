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

import Bans from "model/Bans";
import ChatHelper from "helper/Chat";
import Command from "./Command";
import CommandContext from "context/Command";
import Context from "context/Context";
import Lang from "helper/Lang";
import Log from "helper/Log";
import Message from "context/Message";
import UserContext from "context/User";
import UserHelper from "helper/User";
import { BotCommand } from "library/telegram/type/BotCommand";
import { User as UserType } from "../library/telegram/type/User";

export default class Ban extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "ban", description: "Bans an user from group." },
        { command: "delban", description: "Bans an user from group and deletes their's message." }
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

        this.context = context;
        if (!await this.context.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        this.command = command;
        this.context.getMessage()?.delete();

        let params = command.getParams() || [];

        const replyToMessage = this.context.getMessage()?.getReplyToMessage();
        if (replyToMessage && command.getCommand() === "delban") {
            replyToMessage.delete();
        }

        if (replyToMessage) {
            this.banByReply(replyToMessage, params.join(" ").trim());
            return Promise.resolve();
        }

        const mentions = await this.context.getMessage()?.getMentions();
        if (mentions?.length) {
            params = params.filter((param) => !param.startsWith("@"));
            mentions.forEach((mention) => {
                this.banByMention(mention, params.join(" ").trim());
            });
        }

        const userId = parseInt(params[0]);
        if (userId === Number(params[0])) {
            params.shift();
            this.banByUserId(userId, params.join(" ").trim());
        }
    }

    /**
     * Bans an user by message reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async banByReply(replyToMessage: Message, reason: string): Promise<void> {

        if (!await replyToMessage.getUser()?.ban()) {
            const message = Lang.get("banErrorMessage");
            return this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });
        }

        const user = replyToMessage.getUser();
        user && (this.saveBan(user, reason));

        return Promise.resolve();
    }

    /**
     * Bans an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async banByMention(mention: UserContext, reason: string): Promise<void> {

        if (!await mention.ban()) {
            const message = Lang.get("banErrorMessage");
            return this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });
        }

        this.saveBan(mention, reason);
        return Promise.resolve();
    }

    /**
     * Bans the user by Telegram ID.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param userId
     * @param reason
     */
    private async banByUserId(userId: number, reason: string): Promise<void> {

        const user = await UserHelper.getByTelegramId(userId);
        const userType: UserType = {
            id: userId,
            is_bot: user?.is_bot === 1,
            first_name: user?.first_name ?? "",
            last_name: user?.last_name,
            username: user?.username ?? userId.toString()
        };

        const chat = this.context?.getChat();
        if (!chat) {
            return Promise.resolve();
        }

        const contextUser = new UserContext(userType, chat);
        if (await contextUser.ban()) {
            this.saveBan(contextUser, reason);
        }

        return Promise.resolve();
    }

    /**
     * Saves the ban.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {UserContext} contextUser User object.
     */
    private async saveBan(contextUser: UserContext, reason: string): Promise<void> {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        const user = await UserHelper.getByTelegramId(contextUser.getId());

        if (!user || !chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        const ban = new Bans();
        const insert = ban.insert();
        insert
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("date", Math.floor(Date.now() / 1000));

        if (reason.length) {
            insert.set("reason", reason);
        }

        try {

            await ban.execute();
            const message = Lang.get("bannedMessage")
                .replace("{userid}", contextUser.getId())
                .replace("{username}", contextUser.getFirstName() || contextUser.getUsername())
                .replace("{reason}", reason.length ? reason : Lang.get("reasonUnknown"));

            this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });

        } catch (err: any) {
            Log.error(err.toString());
        }
    }
}
