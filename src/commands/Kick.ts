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
import Context from "contexts/Context";
import Message from "contexts/Message";
import User from "contexts/User";
import CommandContext from "contexts/Command";
import { BotCommand } from "libraries/telegram/types/BotCommand";

export default class Kick extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "kick", description: "Kicks an user from group." }
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
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context?.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        this.context?.getMessage()?.delete();

        const replyToMessage = this.context?.getMessage()?.getReplyToMessage();
        if (replyToMessage) {
            this.kickByReply(replyToMessage);
            return Promise.resolve();
        }

        const mentions = await this.context?.getMessage()?.getMentions();
        if (!mentions?.length) {
            return Promise.resolve();
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
    private async kickByReply(replyToMessage: Message): Promise<boolean|undefined> {
        return replyToMessage.getUser()?.kick();
    }

    /**
     * Bans an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async kickByMention(mention: User): Promise<boolean> {
        return mention.kick();
    }
}
