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
import Message from "../library/telegram/context/Message.js";
import User from "../library/telegram/context/User.js";
import CommandContext from "../library/telegram/context/Command.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import UserContext from "../library/telegram/context/User.js";
import Bans from "../model/Bans.js";
import Lang from "../helper/Lang.js";
import Log from "../helper/Log.js";
import { User as UserType } from "../library/telegram/type/User.js";

export default class Ban extends Command {

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
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["ban"]);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        this.command = command;
        this.context.message.delete();

        let params = command.getParams() || [];

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            this.banByReply(replyToMessage, params.join(" ").trim());
            return;
        }

        const mentions = await this.context.message.getMentions();
        if (mentions.length) {
            params = params.filter((param) => param.indexOf("@") !== 0);
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
    private async banByReply(replyToMessage: Message, reason: string): Promise<Record<string, any>> {
        this.saveBan(replyToMessage.getUser(), reason);
        return replyToMessage.getUser().ban();
    }

    /**
     * Bans an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async banByMention(mention: User, reason: string): Promise<Record<string, any>> {
        this.saveBan(mention, reason);
        return mention.ban();
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
    private async banByUserId(userId: number, reason: string): Promise<Record<string, any>|undefined> {

        const user = await UserHelper.getByTelegramId(userId);

        const userType: UserType = {
            id: userId,
            isBot: user?.is_bot,
            firstName: user?.first_name,
            lastName: user?.last_name,
            username: user?.username || userId
        };

        const contextUser = new UserContext(userType, this.context.chat);
        this.saveBan(contextUser, reason);
        return contextUser.ban();
    }

    /**
     * Saves the ban.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {User} contextUser User object.
     */
    private async saveBan(contextUser: User, reason: string): Promise<void> {

        const user = await UserHelper.getByTelegramId(contextUser.getId());
        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        if (!user || !chat) {
            return;
        }

        Lang.set(chat.language || "us");

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
                .replace("{userId}", contextUser.getId())
                .replace("{username}", contextUser.getFirstName() || contextUser.getUsername())
                .replace("{reason}", reason.length ? reason : "Unknown");

            this.context.chat.sendMessage(message, { parseMode: "HTML" });

        } catch (err: any) {
            Log.error(err.toString());
        }
    }
}
