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
import BotCommand from "../library/telegram/type/BotCommand.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";

export default class Ask extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    private static commands: BotCommand[] = [
        { command: "ask", description: "Shows the ask to ask answering status. Manages it with [on | off]." }
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
     * Run the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @return {Promise<void>}
     */
    public async run(): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        this.context.message.delete();

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        Lang.set(chat?.language || "us");

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            replyToMessage.reply(Lang.get("askToAskLink"));
            return;
        }

        this.context.chat.sendMessage(Lang.get("askToAskLink"));
    }
}
