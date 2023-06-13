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
import ChatHelper from "../helper/Chat";
import UserHelper from "../helper/User";
import Lang from "../helper/Lang";

export default class Ask extends Command {

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
        this.setCommands(["ask"]);
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

        if (!await UserHelper.isAdmin(this.context)) {
            return;
        }

        this.context.message.delete();

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        Lang.set(chat.language || "us");

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            replyToMessage.reply(Lang.get("askToAskLink"));
            return;
        }

        this.context.chat.sendMessage(Lang.get("askToAskLink"));
    }
}
