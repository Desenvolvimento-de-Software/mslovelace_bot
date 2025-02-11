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
import { InlineKeyboardButton } from "../library/telegram/type/InlineKeyboardButton.js";
import { InlineKeyboardMarkup } from "../library/telegram/type/InlineKeyboardMarkup.js";

export default class Start extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     */
    public readonly commands: BotCommand[] = [
        { command: "start", description: "Starts the bot." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor() {
        super();
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since 1.0.0
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

        Lang.set(chat.language || "us");

        if (this.context.chat.getType() !== "private") {

            const message = Lang.get("groupStartMessage")
                .replace("{userid}", this.context.user.getId())
                .replace("{username}", this.context.user.getFirstName() ?? this.context.user.getUsername());

            this.context.message.reply(message, { parseMode: "HTML" });
            return;
        }

        const helpButton: InlineKeyboardButton = {
            text: Lang.get("helpButton"),
            callback_data: "help"
        };

        const username = process.env.TELEGRAM_USERNAME;
        const groupAddButton: InlineKeyboardButton = {
            text : Lang.get("startButton"),
            url : `http://t.me/${username}?startgroup=botstart`
        };

        const markup: InlineKeyboardMarkup = {
            inline_keyboard : [[helpButton, groupAddButton]]
        };

        const options = { parseMode: "HTML", replyMarkup: markup };
        this.context.chat.sendMessage(Lang.get("startMessage"), options);
    }
}
