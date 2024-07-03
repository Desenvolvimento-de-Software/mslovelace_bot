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
import { BotCommand } from "../library/telegram/type/BotCommand.js";

export default class Kick extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
        { command: "kick", description: "Kicks an user from group." }
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
            this.kickByReply(replyToMessage);
            return;
        }

        const mentions = await this.context.message.getMentions();
        if (!mentions.length) {
            return;
        }

        for (const mention of mentions) {
            this.kickByMention(mention);
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
    private async kickByReply(replyToMessage: Message): Promise<Record<string, any>> {
        return replyToMessage.getUser().kick();
    }

    /**
     * Bans an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async kickByMention(mention: User): Promise<Record<string, any>> {
        return mention.kick();
    }
}
