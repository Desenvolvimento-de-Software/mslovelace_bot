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

import Chat from "./Chat";
import Message from "./Message";
import User from "./User";
import CallbackQuery from "./CallbackQuery";
import { Message as MessageType } from "../type/Message";

export default class Context {

    public chat: Chat;
    public message: Message;
    public user: User;
    public newChatMember?: User;
    public leftChatMember?: User;
    public callbackQuery?: CallbackQuery
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

        if (this.type === "callbackQuery") {
            this.callbackQuery = new CallbackQuery(this.payload);
        }

        const context = this.parseMessage();
        if (!context) {
            throw new Error("Invalid context.");
        }

        this.chat = new Chat(context);
        this.message = new Message(context);
        this.user = new User(this.payload[this.type].from!, this.chat);

        if (context.newChatMember) {
            this.newChatMember = new User(context.newChatMember, this.chat);
        }

        if (context.leftChatMember) {
            this.leftChatMember = new User(context.leftChatMember, this.chat);
        }
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

            case this.payload.hasOwnProperty("callbackQuery"):
                return "callbackQuery";

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
    private parseMessage(): MessageType|undefined {

        if (this.type === "callbackQuery") {
            return this.payload.callbackQuery.message;
        }

        return this.payload[this.type] || undefined;
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
