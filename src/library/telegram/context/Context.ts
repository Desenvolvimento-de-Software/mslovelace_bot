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
import { Context as ContextType } from "../type/Context.js";
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
        "chat_join_request",
        "chat_member",
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
            throw new Error(JSON.stringify(payload) + "\nIgnored context.");
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

        if (this.type === "chat_member" && context.new_chat_member?.status === "member" && !context.old_chat_member?.is_member) {
            const newChatMember = context.new_chat_member.user;
            this.newChatMember = new User(newChatMember, this.chat);
        }

        if (this.type === "chat_member" && (context.new_chat_member?.status === "left" || context.new_chat_member?.is_member === false)) {
            const leftChatMember = context.new_chat_member.user;
            this.leftChatMember = new User(leftChatMember, this.chat);
        }
    }

    /**
     * Returns the context type.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @return {string|undefined}
     */
    public getType(): string|undefined {
        return this.type;
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
     * @return {ContextType}
     */
    private parseMessage(): ContextType|undefined {

        if (this.type === "callback_query") {
            return this.payload.callbackQuery.message;
        }

        return this.payload[this.type!] || undefined;
    }
}
