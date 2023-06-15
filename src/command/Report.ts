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
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";
import Text from "../helper/Text.js";

export default class Report extends Command {

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
        this.setCommands(["admin", "adm", "report"]);
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
    public async run(): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
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
            this.context.message.getReplyToMessage()!.reply(reportMessage, options);
            return;
        }

        this.context.message.reply(reportMessage, options);
    }
}
