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

import SendMessage from "../library/telegram/resource/SendMessage.js";

import { Message } from "../type/Message";

export default class Context {

    // private updateId: number;
    // private type: string;
    // private action: string;
    // private user: From;
    // private chat: Chat;
    // private message: Message;
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
        this.message = this.parseMessage();

        console.log(this.payload);
        // this.updateId = this.payload.update_id;


        // this.user = this.parseUser();
        // this.chat = this.parseChat();
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
                return "edited_message";

            default:
                return "message";
        }
    }

    private parseMessage(): Message {
    }

    /**
     * Parses the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @returns
     */
    // private parseUser(): From {

        // if (!this.payload[this.type].from) {
            // throw new Error("Invalid payload: No user found.");
        // }

        // return <From> {
            // id: this.payload[this.type].from.id,
            // isBot: this.payload[this.type].from.is_bot,
            // firstName: this.payload[this.type].from.first_name,
            // lastName: this.payload[this.type].from.last_name,
            // username: this.payload[this.type].from.username,
            // languageCode: this.payload[this.type].from.language_code
        // };
    // }

    /**
     * Parses the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @returns
     */
    // private parseChat(): Chat {

        // if (!this.payload[this.type].chat) {
        //     throw new Error("Invalid payload: No chat found.");
        // }

        // const chat = <Chat> {
        //     id: this.payload[this.type].chat.id,
        //     type: this.payload[this.type].chat.type,
        //     title: this.payload[this.type].chat.title,
        // };

        // if (this.payload[this.type].chat.username) {
        //     chat.username = this.payload[this.type].chat.username;
        // }

        // if (this.payload[this.type].chat.first_name) {
        //     chat.firstName = this.payload[this.type].chat.first_name;
        // }

        // if (this.payload[this.type].chat.last_name) {
        //     chat.lastName = this.payload[this.type].chat.last_name;
        // }

        // return chat;
    // }

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
