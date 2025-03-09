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
import Context from "./Context";
import Message from "./Message";
import User from "./User";
import { CallbackQuery as CallbackQueryType} from "libraries/telegram/types/CallbackQuery";
import { ChatMemberUpdated } from "libraries/telegram/types/ChatMemberUpdated";
import { Message as MessageType } from "libraries/telegram/types/Message";
import { User as UserType } from "libraries/telegram/types/User";
import { Update } from "libraries/telegram/types/Update";
import { ChatMemberTypes } from "libraries/telegram/types/ChatMember";
import CallbackQuery from "./CallbackQuery";

export default class ContextFactory {

    /**
     * The types of the context.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @var {string[]}
     */
    private static readonly types: { [key: string]: (key: string, update: Update) => Context|undefined } = {
        "message": ContextFactory.createFromMessage,
        "edited_message": ContextFactory.createFromMessage,
        "channel_post": ContextFactory.createFromMessage,
        "edited_channel_post": ContextFactory.createFromMessage,
        "business_connection": ContextFactory.createFromBusinessConnection,
        "business_message": ContextFactory.createFromMessage,
        "edited_business_message": ContextFactory.createFromMessage,
        "deleted_business_messages": ContextFactory.createFromBusinessMessagesDeleted,
        "message_reaction": ContextFactory.createFromMessageReaction,
        "inline_query": ContextFactory.createFromInlineQuery,
        "chosen_inline_result": ContextFactory.createFromChosenInlineResult,
        "callback_query": ContextFactory.createFromCallbackQuery,
        "shipping_query": ContextFactory.createFromShippingQuery,
        "pre_checkout_query": ContextFactory.createFromPreCheckoutQuery,
        "poll": ContextFactory.createFromPoll,
        "poll_answer": ContextFactory.createFromPollAnswer,
        "my_chat_member": ContextFactory.createFromChatMemberUpdated,
        "chat_member": ContextFactory.createFromChatMemberUpdated,
        "chat_join_request": ContextFactory.createFromChatJoinRequest,
        "chat_boost": ContextFactory.createFromChatBoost,
        "removed_from_chat": ContextFactory.createFromChatBoost
    };

    /**
     * Creates a new context from the given update.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param update
     *
     * @return {Context}
     */
    public static create(update: Update): Context|undefined {

        for (const key of Object.keys(ContextFactory.types) as (keyof Update)[]) {
            if (key in update && update[key] !== undefined) {
                return ContextFactory.types[key](key, update);
            }
        }

        throw new Error("Unknown context type\n" + JSON.stringify(update));
    }

    /**
     * Creates a new context from the given message.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromMessage(key: string, update: Update): Context|undefined {

        const context = new Context(key, update);
        const updateData = update[key as keyof Update] as MessageType;
        if (typeof updateData !== "object") {
            return undefined;
        }

        let chat;
        if ("chat" in updateData) {
            chat = new Chat(updateData.chat);
            context.setChat(chat);
        }

        if (typeof chat !== "undefined" && "from" in updateData) {
            const from = updateData.from as UserType;
            const user = new User(from, chat);
            context.setUser(user);
        }

        if (typeof chat !== "undefined" && "new_chat_member" in updateData) {
            const newChatMember = new User(updateData.new_chat_member as UserType, chat);
            context.setNewChatMember(newChatMember);
        }

        if (typeof chat !== "undefined" && "left_chat_member" in updateData) {
            const leftChatMember = new User(updateData.left_chat_member as UserType, chat);
            context.setLeftChatMember(leftChatMember);
        }

        const message = new Message(updateData);
        context.setMessage(message);

        return context;
    }

    /**
     * Creates a new context from a business connection.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromBusinessConnection(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a business message deleted.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromBusinessMessagesDeleted(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a message reaction.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromMessageReaction(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from an inline query.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromInlineQuery(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a chosen inline result.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromChosenInlineResult(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a callback query.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromCallbackQuery(key: string, update: Update): Context|undefined {

        const context = new CallbackQuery(key, update);
        const updateData = update[key as keyof Update] as CallbackQueryType;
        if (typeof updateData !== "object") {
            return undefined;
        }

        let chat;
        if ("message" in updateData && updateData.message && "chat" in updateData.message) {
            chat = new Chat(updateData.message.chat);
            context.setChat(chat);
        }

        if (typeof chat !== "undefined" && "from" in updateData) {
            const from = updateData.from;
            const user = new User(from, chat);
            context.setUser(user);
        }

        if ("message" in updateData && updateData.message) {
            const message = new Message(updateData.message);
            context.setMessage(message);
        }

        if ("data" in updateData && typeof updateData.data === "string") {
            context.setData(updateData.data);
        }

        return context;
    }

    /**
     * Creates a new context from a shipping query.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromShippingQuery(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a pre checkout query.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromPreCheckoutQuery(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a poll.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromPoll(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a poll answer.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromPollAnswer(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a member update.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromChatMemberUpdated(key: string, update: Update): Context|undefined {

        const context = new Context(key, update);
        const updateData = update[key as keyof Update] as ChatMemberUpdated;
        if (typeof updateData !== "object") {
            return undefined;
        }

        let chat;
        if ("chat" in updateData) {
            chat = new Chat(updateData.chat);
            context.setChat(chat);
        }

        if (typeof chat !== "undefined" && "from" in updateData) {
            const from = updateData.from;
            const user = new User(from, chat);
            context.setUser(user);
        }

        if (typeof chat !== "undefined" && "new_chat_member" in updateData) {

            const oldChatMember: ChatMemberTypes = updateData.old_chat_member;
            const newChatMember: ChatMemberTypes = updateData.new_chat_member;

            if (ContextFactory.hasNewChatMember(oldChatMember, newChatMember)) {
                const newUser = new User(newChatMember.user, chat);
                context.setNewChatMember(newUser);
            }

            const isLeftChatMember = (
                "status" in newChatMember && (
                    newChatMember.status === "left" || ("is_member" in newChatMember && newChatMember.is_member === false)
                )
            );

            if (isLeftChatMember) {
                const leftUser = new User(newChatMember.user, chat);
                context.setLeftChatMember(leftUser);
            }
        }

        return context;
    }

    /**
     * Creates a new context from a chat join request.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromChatJoinRequest(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Creates a new context from a chat boost.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param key
     * @param update
     *
     * @return {Context|undefined}
     */
    private static createFromChatBoost(key: string, update: Update): Context|undefined {
        return undefined;
    }

    /**
     * Returns whether the chat has a new member or not.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param oldChatMember
     * @param newChatMember
     *
     * @return {boolean}
     */
    private static hasNewChatMember(oldChatMember: ChatMemberTypes, newChatMember: ChatMemberTypes): boolean {

        let newUser, oldUser;
        "user" in newChatMember && (newUser = newChatMember.user);
        "user" in oldChatMember && (oldUser = oldChatMember.user);

        if (!newUser || !oldUser) {
            return false;
        }

        if ("is_member" in oldUser && oldUser.is_member) {
            return false;
        }

        if ("status" in oldChatMember && !["left", "kicked", "banned"].includes(oldChatMember.status)) {
            return false;
        }

        if ("is_member" in newChatMember && !newChatMember.is_member) {
            return false;
        }

        if ("status" in newChatMember && ["left", "kicked", "banned"].includes(newChatMember.status)) {
            return false;
        }

        return true;
    }
};
