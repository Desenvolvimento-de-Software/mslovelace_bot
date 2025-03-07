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

import Iinterval from "interface/Iinterval";
import DeleteMessage from "library/telegram/resource/DeleteMessage";
import Messages from "model/Messages";
import { ResultSetHeader } from "mysql2";

type MessageType = {
    user_id: number,
    chat_id: number,
    message_id: number,
    telegram_user_id: number,
    telegram_chat_id: number,
    telegram_message_id: number
};

export default class DeleteExpiredMessages implements Iinterval {

    /**
     * Current interval.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    private readonly interval: NodeJS.Timer;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    public constructor() {
        this.run();
    }

    /**
     * Destroys the interval.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    public destroy(): void {
        clearTimeout(this.interval);
    }

    /**
     * Interval routines.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    private readonly run = async (): Promise<void> => {

        this.interval = setTimeout(this.run, 5000);

        const messages = await this.getMessages();
        if (!messages.length) {
            return Promise.resolve();
        }

        await this.deleteMessages(messages);
        await this.updateDatabase(messages);
    }

    /**
     * Returns the messages to be deleted.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @return {MessageType[]}
     */
    private async getMessages(): Promise<MessageType[]> {

        const timestamp = Math.floor(Date.now() / 1000);
        const messages = new Messages();

        const fields: string[] = [
            "users.user_id telegram_user_id",
            "chats.chat_id telegram_chat_id",
            "messages.id message_id",
            "messages.message_id telegram_message_id"
        ];

        messages
            .select(fields)
            .innerJoin("users", "users.id = messages.user_id")
            .innerJoin("chats", "chats.id = messages.chat_id")
            .where("messages.ttl").isNotNull()
            .and("messages.ttl").lessThan(timestamp)
            .and("status").equal(1);

        const rows = await messages.execute<MessageType[]>();
        if (!rows.length) {
            return [];
        }

        return rows;
    }

    /**
     * Deletes the messages and returns the message IDs.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param messages
     */
    private async deleteMessages(messages: MessageType[]): Promise<void> {
        messages.forEach(async (message) => {
            const deleteMessage = new DeleteMessage();
            deleteMessage
                .setChatId(message.telegram_chat_id)
                .setMessageId(message.telegram_message_id)
                .post();
        });
    }

    /**
     * Updates the database changing the messages status.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param messages
     *
     * @returns {Promise<boolean>}
     */
    private async updateDatabase(messages: MessageType[]): Promise<boolean> {

        if (!messages.length) {
            return Promise.resolve(false);
        }

        const messageIds = messages.map((message) => message.message_id);
        const messagesModel = new Messages();
        messagesModel
            .update()
            .set("status", 0)
            .where("id").in(messageIds);

        const result = await messagesModel.execute<ResultSetHeader>();
        return result.affectedRows > 0;
    }
}
