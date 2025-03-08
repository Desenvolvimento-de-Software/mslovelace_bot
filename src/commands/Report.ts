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
import CommandContext from "contexts/Command";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import Text from "helpers/Text";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { getChatByTelegramId } from "services/Chats";

export default class Report extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "adm", description: "Reports a message to the group administrators." },
        { command: "admin", description: "Reports a message to the group administrators." },
        { command: "report", description: "Reports a message to the group administrators." }
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

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        const admins = await this.context.getChat()?.getChatAdministrators();
        if (!admins?.length) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");
        let reportMessage = Text.markdownEscape(Lang.get("reportMessage"));

        for (const admin of admins) {
            reportMessage += `[​](tg://user?id=${admin})`;
        }

        const options = {
            parse_mode: "MarkdownV2",
            disable_notification: false
        };

        const replyToMessage = this.context.getMessage()?.getReplyToMessage();
        if (typeof replyToMessage !== "undefined") {
            this.reportByReply(reportMessage, options);
            return Promise.resolve();
        }

        this.context.getMessage()?.reply(reportMessage, options);
    }

    /**
     * Reports an user by reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     *
     * @param {string} reportMessage
     * @param {Record<string, any>} options
     */
    private async reportByReply(reportMessage: string, options: Record<string, any>): Promise<void> {

        const contextMessage = this.context?.getMessage()?.getReplyToMessage();
        if (!contextMessage) {
            return Promise.resolve();
        }

        const contextUser = contextMessage.getUser();
        if (contextUser?.getId() === parseInt(process.env.TELEGRAM_USER_ID!)) {
            this.context?.getMessage()?.reply(Lang.get("selfReportMessage"));
            return Promise.resolve();
        }

        if (await contextUser?.isAdmin()) {
            this.context?.getMessage()?.reply(Lang.get("adminReportMessage"));
            return Promise.resolve();
        }

        contextMessage.reply(reportMessage, options);
    }
}
