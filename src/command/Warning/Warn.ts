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
import BotCommand from "../library/telegram/type/BotCommand.js";
import WarningsModel from "../../model/Warnings.js";
import WarningsBase from "./Base.js";
import UserHelper from "../../helper/User.js";
import ChatHelper from "../../helper/Chat.js";
import Lang from "../../helper/Lang.js";
import Log from "../../helper/Log.js";

export default class Warn extends WarningsBase {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
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
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
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

        this.command = command;

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat) {
            return;
        }

        const params = this.command!.getParams();
        if (!params || !params.length) {
            return;
        }

        Lang.set(chat.language || "us");

        const users = [];
        const warningLimit = await this.getWarningLimit(chat);
        const replyToMessage = this.context.message.getReplyToMessage();

        if (replyToMessage && command.command === "delwarn") {
            replyToMessage.delete();
        }

        if (replyToMessage) {
            users.push(replyToMessage.getUser());
        }

        const mentions = await this.context.message.getMentions() || [];
        for (const mention of mentions) {
            users.push(mention);
            params.shift();
        }

        if (!users.length) {
            return;
        }

        for (let i = 0, length = users.length; i < length; i++) {
            const contextUser = users[i];
            await this.warn(contextUser, chat, warningLimit, params.join(" "));
        }

        this.sendWarningMessages(users, chat);
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
            this.context.message.reply(Lang.get("selfWarnMessage"));
            return;
        }

        if (await contextUser.isAdmin()) {
            this.context.message.reply(Lang.get("adminWarnMessage"));
            return;
        }

        const user = await UserHelper.getByTelegramId(contextUser.getId());
        if (!user) {
            return;
        }

        this.context.message.delete();

        const warn = new WarningsModel();
        warn
            .insert()
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("date", Math.ceil(Date.now() / 1000))
            .set("reason", reason);

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

        const results = await warnings.execute();

        if (results.length >= warningLimit) {
            contextUser.ban();
        }

        return Promise.resolve();
    }
}
