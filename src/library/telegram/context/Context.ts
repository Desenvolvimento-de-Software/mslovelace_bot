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

import Chat from "./Chat.js";
import Message from "./Message.js";
import User from "./User.js";
import CallbackQuery from "./CallbackQuery.js";
import { Message as MessageType } from "../type/Message.js";
export default class Context {

    /**
     * Chat context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {Chat}
     */
    public chat: Chat;

    /**
     * Message context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {Message}
     */
    public message: Message;

    /**
     * User context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {User}
     */
    public user: User;

    /**
     * New chat member context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {User}
     */
    public newChatMember?: User;

    /**
     * Left chat member context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {User}
     */
    public leftChatMember?: User;

    /**
     * Callback query context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {CallbackQuery}
     */
    public callbackQuery?: CallbackQuery

    /**
     * The type of the context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {string|undefined}
     */
    public type: string|undefined;

    /**
     * The payload.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {Record<string, any>}
     */
    private payload: Record<string, any>;

    /**
     * The types of the context.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @var {string[]}
     */
    private types: string[] = [
        "message",
        "edited_message",
        "channel_post",
        "edited_channel_post",
        "inline_query",
        "chosen_inline_result",
        "callback_query",
        "shipping_query",
        "pre_checkout_query",
        "poll",
        "poll_answer",
        "my_chat_member",
        "chat_member",
        "chat_join_request",
        "message_reaction"
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param payload
     */
    public constructor(payload: Record<string, any>) {

        this.payload = payload;
        this.type = this.parseType();

        if (typeof this.type === "undefined") {
            throw new Error(JSON.stringify(payload) + "\nInvalid context.");
        }

        if (this.type === "callback_query") {
            this.callbackQuery = new CallbackQuery(this.payload);
        }

        const context = this.parseMessage();
        if (!context) {
            throw new Error(JSON.stringify(payload) + "\nInvalid context.");
        }

        this.chat = new Chat(context);
        this.message = new Message(context);
        this.user = new User(this.payload[this.type].from, this.chat);

        if (context.new_chat_member) {
            const newChatMember = context.new_chat_member.user || context.new_chat_member;
            this.newChatMember = new User(newChatMember, this.chat);
        }

        if (context.left_chat_member) {
            const leftChatMember = context.left_chat_member.user || context.left_chat_member;
            this.leftChatMember = new User(leftChatMember, this.chat);
        }
    }

    /**
     * Returns the payload.
     *
     * @author Marcos Leandro
     * @since  2024-06-30
     *
     * @returns Record<string, any>
     */
    public getPayload(): Record<string, any> {
        return this.payload;
    }

    /**
     * Returns the type of the context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @return {string}
     */
    private parseType(): string|undefined {
        for (const type of this.types) {
            if (this.payload.hasOwnProperty(type as keyof typeof this.payload)) {
                return type;
            }
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

        if (this.type === "callback_query") {
            return this.payload.callbackQuery.message;
        }

        return this.payload[this.type!] || undefined;
    }
}
