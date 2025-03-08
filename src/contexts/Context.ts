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

import CallbackQuery from "./CallbackQuery";
import Chat from "./Chat";
import Message from "./Message";
import User from "./User";
import { Update } from "../libraries/telegram/types/Update";
export default class Context {

    /**
     * Chat context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {Chat}
     */
    protected chat?: Chat;

    /**
     * Message context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {Message}
     */
    protected message?: Message;

    /**
     * User context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {User}
     */
    protected user?: User;

    /**
     * New chat member context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {User}
     */
    protected newChatMember?: User;

    /**
     * Left chat member context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {User}
     */
    protected leftChatMember?: User;

    /**
     * Callback query context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {CallbackQuery}
     */
    protected callbackQuery?: CallbackQuery

    /**
     * The type of the context.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {string|undefined}
     */
    protected type: string|undefined;

    /**
     * The payload.
     *
     * @author Marcos Leandro
     * @since  2023-06-01
     *
     * @var {Update}
     */
    protected readonly payload: Update;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param payload
     */
    public constructor(type: string, payload: Update) {
        this.type = type;
        this.payload = payload;
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
     * Returns the context user.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @return {User|undefined}
     */
    public getUser(): User|undefined {
        return this.user;
    }

    /**
     * Returns the context chat.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @return {Chat|undefined}
     */
    public getChat(): Chat|undefined {
        return this.chat;
    }

    /**
     * Returns the context message.
     *
     * @return {Message|undefined}
     */
    public getMessage(): Message|undefined {
        return this.message;
    }

    /**
     * Returns the new chat member.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @return {User|undefined}
     */
    public getNewChatMember(): User|undefined {
        return this.newChatMember;
    }

    /**
     * Returns the left chat member.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @return {User|undefined}
     */
    public getLeftChatMember(): User|undefined {
        return this.leftChatMember;
    }

    /**
     * Returns the callback query.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @return {CallbackQuery|undefined}
     */
    public getCallbackQuery(): CallbackQuery|undefined {
        return this.callbackQuery;
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
     * Sets the context user.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param user
     */
    public setUser(user: User): void {
        this.user = user;
    }

    /**
     * Sets the context chat.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param message
     */
    public setChat(chat: Chat): void {
        this.chat = chat;
    }

    /**
     * Sets the context message.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param message
     */
    public setMessage(message: Message): void {
        this.message = message;
    }

    /**
     * Sets the new chat member.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param newChatMember
     */
    public setNewChatMember(newChatMember: User): void {
        this.newChatMember = newChatMember;
    }

    /**
     * Sets the left chat member.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param leftChatMember
     */
    public setLeftChatMember(leftChatMember: User): void {
        this.leftChatMember = leftChatMember;
    }

    /**
     * Sets the callback query.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param callbackQuery
     */
    public setCallbackQuery(callbackQuery: CallbackQuery): void {
        this.callbackQuery = callbackQuery;
    }
}
