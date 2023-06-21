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
import CommandContext from "../library/telegram/context/Command.js";
import User from "../library/telegram/context/User.js";
import Message from "../library/telegram/context/Message.js";
import ChatConfigs from "../model/ChatConfigs.js";
import Warns from "../model/Warns.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";
import Log from "../helper/Log.js";

export default class Warn extends Command {

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
        this.setCommands(["warn"]);
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

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            this.warnByReply(replyToMessage);
            return;
        }

        const mentions = await this.context.message.getMentions();
        if (!mentions.length) {
            return;
        }

        for (const mention of mentions) {
            this.warnByMention(mention);
        }
    }

    /**
     * Warns an user by message reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async warnByReply(replyToMessage: Message): Promise<void> {

        const params = this.command!.getParams();
        if (!params || !params.length) {
            return;
        }

        this.warn(replyToMessage.getUser(), params.join(" "));
    }

    /**
     * Warns an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async warnByMention(mention: User): Promise<void> {

        const params = this.command!.getParams();
        if (!params || !params.length) {
            return;
        }

        params.shift();
        this.warn(mention, params.join(" "));
    }

    /**
     * Saves the user warning.
     *
     * @author Marcos Leandro
     * @since  2023-06-14
     *
     * @param {User} contextUser
     * @param {string} reason
     */
    private async warn(contextUser: User, reason: string): Promise<void> {

        const user = await UserHelper.getUserByTelegramId(contextUser.getId());
        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());

        if (!user || !chat) {
            return;
        }

        Lang.set(chat.language || "us");

        if (contextUser.getId() === parseInt(process.env.TELEGRAM_USER_ID!)) {
            this.context.message.reply(Lang.get("selfWarnMessage"));
            return;
        }

        if (await contextUser.isAdmin()) {
            this.context.message.reply(Lang.get("adminWarnMessage"));
            return;
        }

        this.context.message.delete();

        const warn = new Warns();
        warn
            .insert()
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("date", Math.ceil(Date.now() / 1000))
            .set("reason", reason);

        try {
            await warn.execute();
            this.reportWarnAndBan(contextUser, user, chat);

        } catch (error) {
            Log.save(error as string);
        }
    }

    /**
     * Reports the warning and bans the user if necessary.
     *
     * @author Marcos Leandro
     * @since  2023-06-14
     *
     * @param {User} contextUser
     * @param {Record<string, any>} user
     * @param {Record<string, any>} chat
     */
    private async reportWarnAndBan(contextUser: User, user: Record<string, any>, chat: Record<string, any>): Promise<void> {

        const warn = new Warns();
        warn
            .select()
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .orderBy("date", "ASC");

        const warns = await warn.execute();

        const chatConfigs = new ChatConfigs();
        chatConfigs
            .select()
            .where("chat_id").equal(chat.id);

        const chatConfig = await chatConfigs.execute();
        const warnLimit = chatConfig[0].warn_limit || 3;

        const username = this.context.user.getFirstName() || this.context.user.getUsername();
        const langIndex = warns.length === 1 ? "warningSigleMessage" : "warningPluralMessage";

        let message = Lang.get(langIndex)
            .replace("{userid}", this.context.user.getId())
            .replace("{username}", username)
            .replace("{warns}", warns.length.toString() + "/" + warnLimit.toString());

        if (warns.length >= warnLimit) {
            contextUser.ban();
            message = Lang.get("warningBanMessage")
                .replace("{userid}", this.context.user.getId())
                .replace("{username}", username)
                .replace("{warns}", warns.length.toString() + "/" + warnLimit.toString());
        }

        for (let i = 0, length = warns.length; i < length; i++) {
            message += ` • ${warns[i].reason}\n`;
        }

        this.context.chat.sendMessage(message, { parseMode: "HTML" });
    }
}
