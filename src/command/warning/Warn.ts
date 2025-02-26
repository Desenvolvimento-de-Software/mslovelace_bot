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
import Context from "context/Context";
import CommandContext from "context/Command";
import Lang from "helper/Lang";
import Log from "helper/Log";
import User from "context/User";
import UserHelper from "helper/User";
import WarningsModel from "model/Warnings";
import WarningsBase from "./Base";
import { BotCommand } from "library/telegram/type/BotCommand";
import { Warning as WarningType } from "model/type/Warning";

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

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        const params = this.command.getParams();
        if (!params?.length) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        const users: User[] = [];
        const warningLimit = await this.getWarningLimit(chat);
        const replyToMessage = this.context.getMessage()?.getReplyToMessage();

        if (replyToMessage && command.getCommand() === "delwarn") {
            replyToMessage.delete();
        }

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
            user && (await this.warn(user, chat, warningLimit, params.join(" ")));
        }

        users?.length && (this.sendWarningMessages(users, chat));
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
    private async warn(contextUser: User, chat: Record<string, any>, warningLimit: number, reason: string): Promise<void> {

        if (contextUser.getId() === parseInt(process.env.TELEGRAM_USER_ID!)) {
            this.context?.getMessage()?.reply(Lang.get("selfWarnMessage"));
            return Promise.resolve();
        }

        if (await contextUser.isAdmin()) {
            this.context?.getMessage()?.reply(Lang.get("adminWarnMessage"));
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(contextUser.getId());
        if (!user) {
            return Promise.resolve();
        }

        this.context?.getMessage()?.delete();

        const warn = new WarningsModel();
        warn
            .insert()
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("date", Math.ceil(Date.now() / 1000))
            .set("reason", reason.length ? reason : Lang.get("reasonUnknown"));

        try {

            await warn.execute();
            this.checkBan(contextUser, user, chat, warningLimit);

        } catch (error: any) {
            Log.save(error.message, error.stack);
        }
    }

    /**
     * Bans the user if necessary.
     *
     * @author Marcos Leandro
     * @since  2023-06-14
     *
     * @param contextUser
     * @param user
     * @param chat
     * @param warningLimit
     */
    private async checkBan(contextUser: User, user: Record<string, any>, chat: Record<string, any>, warningLimit: number): Promise<void> {

        const warnings = new WarningsModel();
        warnings
            .select()
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .and("status").equal(1)
            .orderBy("date", "ASC");

        const results = await warnings.execute<WarningType[]>();

        if (results.length >= warningLimit) {
            contextUser.ban();
        }

        return Promise.resolve();
    }
}
