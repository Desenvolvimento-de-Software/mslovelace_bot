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
import ChatConfigs from "src/model/ChatConfigs";

export default class Restrict extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
     public constructor(context: Context) {
        super(context);
        this.setCommands(["restrict"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param payload
     */
    public async run(): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        const chatConfig = new ChatConfigs();
        chatConfig
            .update()
            .set("restrict_new_users", 1)
            .where("id").equal(chat.id);

        await chatConfig.execute();
    }
}
