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

import Command from "../Command.js";
import ChatHelper from "../../helper/Chat.js";
import Chats from "../../model/Chats.js";
import SendMessage from "../../library/telegram/resource/SendMessage.js";

export default class GreetingsCommand extends Command {

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
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public index(): void {
        return;
    }

    /**
     * Activates the greetings message.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param payload
     */
    public async on(payload: Record<string, any>): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
        if (!chat || !chat.id) {
            return;
        }

        const update = new Chats();
        update
            .update()
            .set("greetings", true)
            .where("id").equal(chat.id);

        const result = await update.execute();
        if (result.affectedRows > 0) {

            const sendMessage = new SendMessage();
            sendMessage
                .setChatId(payload.message.chat.id)
                .setText("Greetings activated");

            sendMessage.post();
        }
    }

    /**
     * Deactivates the greetings message.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param payload
     */
    public async off(payload: Record<string, any>): Promise<void> {
        console.log("Disabling the greetings");
    }
}
