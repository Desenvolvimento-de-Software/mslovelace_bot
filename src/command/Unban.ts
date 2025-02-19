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
import Command from "./Command";
import CommandContext from "context/Command";
import Context from "context/Context";
import Lang from "helper/Lang";
import Log from "helper/Log";
import Message from "context/Message";
import User from "context/User";
import UserHelper from "helper/User";
import { BotCommand } from "library/telegram/type/BotCommand";

export default class Unban extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "unban", description: "Unbans an user from group." }
    ];

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
     * @param command
     *
     * @returns
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context?.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        this.context?.getMessage()?.delete();

        const replyToMessage = this.context?.getMessage()?.getReplyToMessage();
        if (replyToMessage) {
            this.unbanByReply(replyToMessage);
            return Promise.resolve();
        }

        const mentions = await this.context?.getMessage()?.getMentions();
        if (!mentions?.length) {
            return Promise.resolve();
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
        if (await replyToMessage?.getUser()?.unban()) {
            const user = replyToMessage.getUser();
            user && (this.saveUnban(user));
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
        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!user || !chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        try {

            const message = Lang.get("unbannedMessage")
                .replace("{userid}", contextUser.getId())
                .replace("{username}", contextUser.getFirstName() || contextUser.getUsername());

            this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });

        } catch (err: any) {
            Log.error(err.toString());
        }
    }
}
