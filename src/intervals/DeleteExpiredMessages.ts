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

import Iinterval from "interfaces/Iinterval";
import DeleteMessage from "libraries/telegram/resources/DeleteMessage";
import { getOldMessages, disableOldMessages } from "services/OldMessages";
import { Message as MessageType } from "libraries/telegram/types/Message";

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
        this.interval = setInterval(this.run, 1000);
    }

    /**
     * Destroys the interval.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    public destroy(): void {
        clearInterval(this.interval);
    }

    /**
     * Interval routines.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    private readonly run = async (): Promise<void> => {

        const messages = await this.getMessages();
        if (!messages.length) {
            return Promise.resolve();
        }

        await this.deleteMessages(messages);
        await disableOldMessages(messages);
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

        const messages = await getOldMessages();
        if (!messages.length) {
            return [];
        }

        return messages;
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
                .setMessageId(message.message_id)
                .setChatId(message.chat.id)
                .post();
        });
    }
}
