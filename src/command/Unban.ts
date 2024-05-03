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
import BotCommand from "../library/telegram/type/BotCommand.js";
import User from "../library/telegram/context/User.js";
import CommandContext from "../library/telegram/context/Command.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";
import Log from "../helper/Log.js";

export default class Unban extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
        { command: "unban", description: "Unbans an user from group." }
    ];

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

        this.context.message.delete();

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            this.unbanByReply(replyToMessage);
            return;
        }

        const mentions = await this.context.message.getMentions();
        if (!mentions.length) {
            return;
        }

        for (const mention of mentions) {
            this.unbanByMention(mention);
        }
    }

    /**
     * Bans an user by message reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private async unbanByReply(replyToMessage: Message):  Promise<void> {
        if (await replyToMessage.getUser().unban()) {
            this.saveUnban(replyToMessage.getUser());
        }

        return Promise.resolve();
    }

    /**
     * Bans an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    private async unbanByMention(mention: User):  Promise<void> {

        if (await mention.unban()) {
            this.saveUnban(mention);
        }

        return Promise.resolve();
    }

    /**
     * Saves the unban.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {User} contextUser User object.
     */
    private async saveUnban(contextUser: User): Promise<void> {

        const user = await UserHelper.getByTelegramId(contextUser.getId());
        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        if (!user || !chat) {
            return;
        }

        Lang.set(chat.language || "us");

        try {

            const message = Lang.get("unbannedMessage")
                .replace("{userid}", contextUser.getId())
                .replace("{username}", contextUser.getFirstName() || contextUser.getUsername());

            this.context.chat.sendMessage(message, { parseMode: "HTML" });

        } catch (err: any) {
            Log.error(err.toString());
        }
    }
}
