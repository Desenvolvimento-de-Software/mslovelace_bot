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
import { BotCommand } from "../library/telegram/type/BotCommand.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";
import Text from "../helper/Text.js";

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
        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat?.id) {
            return;
        }

        const admins = await this.context.chat.getChatAdministrators();
        if (!admins.length) {
            return;
        }

        Lang.set(chat.language || "us");
        let reportMessage = Text.markdownEscape(Lang.get("reportMessage"));

        for (const admin of admins) {
            reportMessage += `[​](tg://user?id=${admin})`;
        }

        const options = {
            parseMode: "MarkdownV2",
            disableNotification: false
        };

        const replyToMessage = this.context.message.getReplyToMessage();
        if (typeof replyToMessage !== "undefined") {
            this.reportByReply(reportMessage, options);
            return;
        }

        this.context.message.reply(reportMessage, options);
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

        const contextMessage = this.context!.message.getReplyToMessage();
        if (!contextMessage) {
            return;
        }

        const contextUser = contextMessage.getUser();
        if (contextUser.getId() === parseInt(process.env.TELEGRAM_USER_ID!)) {
            this.context!.message.reply(Lang.get("selfReportMessage"));
            return;
        }

        if (await contextUser.isAdmin()) {
            this.context!.message.reply(Lang.get("adminReportMessage"));
            return;
        }

        contextMessage.reply(reportMessage, options);
    }
}
