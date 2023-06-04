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

import SendMessage from "../telegram/resource/SendMessage.js";
import { Message as MessageType } from "../telegram/type/Message.js";


export default class Message {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @var {MessageType}
     */
    private context: MessageType;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param {string} context
     */
    public constructor(context: MessageType) {
        this.context = context;
    }

    /**
     * Send a message.
     *
     * @author Marcos Leandro
     * @sicne  2023-06-02
     *
     * @param  {string} content
     * @param  {string} parseMode
     *
     * @return {Promise<Record<string, any>>}
     */
    public async reply(content: string, parseMode?: string): Promise<Record<string, any>> {

        if (!parseMode) {
            parseMode = "HTML";
        }

        const sendMessage = new SendMessage();
        sendMessage
            .setReplyToMessageId(this.context.messageId)
            .setChatId(this.context.chat.id)
            .setText(content)
            .setParseMode(parseMode);

        return sendMessage.post();
    }

    /**
     * Deletes the message.
     *
     * @author Marcos Leandro
     * @since  2023-06-03
     *
     * @return {Promise<Record<string, any>>}
     */
    public async delete(): Promise<Record<string, any>> {
        return Promise.resolve({});
    }
}
