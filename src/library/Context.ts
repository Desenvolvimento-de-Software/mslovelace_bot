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

import Message from "./context/Message.js";
import { Message as MessageType } from "./telegram/type/Message.js";

export default class Context {

    public message: Message;
    private context: MessageType;
    private type: string;
    private payload: Record<string, any>;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param payload
     */
    public constructor(payload: Record<string, any>) {
        this.payload = this.snakeToCamelCase(payload);
        this.type = this.parseType();
        this.context = this.parseMessage();
        this.message = new Message(this.context);
    }

    /**
     * Returns the current context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @returns
     */
    public getContext(): MessageType {
        return this.context;
    }

    /**
     * Returns the type of the context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @return string
     */
    private parseType(): string {

        switch (true) {
            case this.payload.hasOwnProperty("editedMessage"):
                return "editedMessage";

            default:
                return "message";
        }
    }

    /**
     * Returns the message.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @return Message
     */
    private parseMessage(): MessageType {
        return this.payload[this.type];
    }

    /**
     * Converts the payload from snake_case to camelCase.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param payload
     *
     * @returns
     */
    private snakeToCamelCase = (payload: Record<string, any>): Record<string, any> => {

        if (Array.isArray(payload)) {
            return payload.map(this.snakeToCamelCase);
        }

        if (typeof payload !== "object" || payload === null) {
            return payload;
        }

        const keys = Object.keys(payload);
        const result = <Record<string, any>> {};

        for (const key of keys) {
            const camelKey = key.toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            result[camelKey] = this.snakeToCamelCase(payload[key]);
        }

        return result;
    };
}