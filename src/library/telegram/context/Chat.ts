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

import Context from "./Context.js";
import SendMessage from "../resource/SendMessage.js";
import GetChatAdministrators from "../resource/GetChatAdministrators.js";
import { Message as MessageType } from "../type/Message.js";

export default class Chat {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    private context: MessageType;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-04
     *
     * @param context
     */
    public constructor(context: MessageType) {
        this.context = context;
    }

    /**
     * Returns the chat id.
     *
     * @author Marcos Leandro
     * @sinc  2023-06-05
     *
     * @returns
     */
    public getId(): number {
        return this.context.chat.id;
    }

    /**
     * Returns the chat type.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns
     */
    public getType(): string {
        return this.context.chat.type;
    }

    /**
     * Returns the chat admins.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns
     */
    public async getChatAdministrators(): Promise<Array<number>> {

        const request = new GetChatAdministrators();
        request.setChatId(this.context.chat.id);

        const response = await request.post();
        const json = await response.json();

        if (!json.hasOwnProperty("ok") || json.ok !== true) {
            return [];
        }

        let admins: Array<number> = [];
        for (let i = 0, length = json.result.length; i < length; i++) {
            admins.push(json.result[i].user.id);
        }

        return Promise.resolve(admins);
    }

    /**
     * Sends a message to the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @param text
     * @param parseMode
     */
    public async sendMessage(text: string, parseMode?: string): Promise<Record<string, any>> {

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(this.context.chat.id)
            .setText(text)
            .setParseMode(parseMode || "HTML")

        return sendMessage.post();
    }
}
