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
import Context from "../library/telegram/context/Context";
import Message from "src/library/telegram/context/Message";
import User from "src/library/telegram/context/User";
import CommandContext from "../library/telegram/context/Command";
import UserHelper from "../helper/User";

export default class Ban extends Command {

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
     *
     * @returns
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await UserHelper.isAdmin(this.context)) {
            return;
        }

        this.context.message.delete();

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            this.banByReply(replyToMessage);
            return;
        }

        const mentions = await this.context.message.getMentions();
        if (!mentions.length) {
            return;
        }

        for (const mention of mentions) {
            this.banByMention(mention);
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
    private async banByReply(replyToMessage: Message): Promise<Record<string, any>> {
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
    private async banByMention(mention: User): Promise<Record<string, any>> {
        return mention.ban();
    }
}
