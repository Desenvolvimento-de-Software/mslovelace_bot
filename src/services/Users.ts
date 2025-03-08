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

import User from "contexts/User";
import { Chat as ChatType } from "libraries/telegram/types/Chat";
import { Message as MessageType } from "libraries/telegram/types/Message";
import { PrismaClient, bans, users } from "@prisma/client";
import { RelUserAndChat as RelUserAndChatType } from "types/UserAndChat";
import { User as UserType } from "libraries/telegram/types/User";

const prisma = new PrismaClient();

/**
 * Returns the user by the ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param userId
 *
 * @return User object.
 */
export async function getUserById(userId: number): Promise<users|null> {
    const result = await get({ id: userId });
    return result ?? null;
}

/**
 * Returns the user by the Telegram ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param userContext
 *
 * @return User object.
 */
export async function getUserByTelegramId(telegramUserId: number): Promise<users|null> {
    const result = await get({ user_id: telegramUserId });
    return result ?? null;
}

/**
 * Returns the user by it's username.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param username
 *
 * @return User object.
 */
export async function getUserByUsername(username: string): Promise<users|null> {
    const result = await get({ username: username });
    return result ?? null;
}

/**
 * Returns the user and chat by the captcha.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param captcha
 *
 * @return User and chat object.
 */
export async function getUserAndChatByCaptcha(captcha: string): Promise<RelUserAndChatType|null> {

    const result = await prisma.rel_users_chats.findFirst({
        where: {
            captcha: captcha
        },
        include: {
            users: true,
            chats: {
                include: {
                    chat_configs: true
                }
            },
        }

    }).then(async (response) => {
        prisma.$disconnect();
        return response;

    }).catch(async (e: Error) => {
        prisma.$disconnect();
        throw e;
    });

    return result as RelUserAndChatType ?? null;
}

/**
 * Returns the non-verified users.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @return {Promise<MessageType[]>}
 */
export async function getNonVerifiedUsers(): Promise<MessageType[]> {

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const users = await prisma.rel_users_chats.findMany({
        where: {
            ttl: {
                not: null,
                lt: currentTimestamp
            },
            joined: true,
            checked: false
        },
        include: {
            users: true,
            chats: true
        }

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(async () => {
        prisma.$disconnect();
    });

    if (!users) {
        return Promise.resolve([]);
    }

    type OldMessagesType = {
        users: any,
        chats: any
    };

    return formatResponse<OldMessagesType[]>(users as Array<OldMessagesType>);
};

/**
 * Returns an user, creating it if it doesn't exist.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param user
 *
 * @return User object.
 */
export async function createAndGetUser(user: User): Promise<users> {

    return await prisma.users.upsert({
        where: { user_id: user.getId() },
        update: {
            username: user.getUsername() ?? null,
            first_name: user.getFirstName()!,
            last_name: user.getLastName() ?? null,
            is_bot: user.getIsBot(),
            is_premium: user.getIsPremium(),
            language_code: user.getLanguageCode() ?? "en",
        },
        create: {
            user_id: user.getId(),
            username: user.getUsername() ?? null,
            first_name: user.getFirstName()!,
            last_name: user.getLastName() ?? null,
            is_bot: user.getIsBot(),
            is_premium: user.getIsPremium(),
            language_code: user.getLanguageCode() ?? "en",
        }

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(async () => {
        prisma.$disconnect();
    });
}

/**
 * Adds the user ban row.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param userId
 * @param chatId
 * @param federation_id
 * @param reason
 *
 * @return Ban row.
 */
export async function ban(userId: number, chatId: number, federation_id: number|null, reason?: string|null): Promise<bans|null> {

    const result = await prisma.bans.create({
        data: {
            user_id: userId,
            chat_id: chatId,
            federation_id: federation_id,
            reason: reason,
            date: Math.floor(Date.now() / 1000)
        }

    }).then(async (response) => {
        prisma.$disconnect();
        return response;

    }).catch(async (e: Error) => {
        prisma.$disconnect();
        throw e;
    });

    return result ?? null;
}

/**
 * Queries the database for a user.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param where
 */
async function get(where: PrismaClient['users']['findFirst']['arguments']['where']): Promise<users|null> {

    const result = await prisma.users.findFirst({
        where: where

    }).then(async (response) => {
        prisma.$disconnect();
        return response;

    }).catch(async (e: Error) => {
        prisma.$disconnect();
        throw e;
    });

    return result ?? null;
}

/**
 * Formats the response.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param result
 *
 * @return {MessageType[]}
 */
function formatResponse<T extends Array<any>>(result: T): MessageType[] {

    return result.map((message) => {
        const from = <UserType> {
            id: Number(message.users.user_id),
            is_bot: message.users.is_bot,
            first_name: message.users.first_name,
            last_name: message.users.last_name,
            username: message.users.username,
            language_code: message.users.language_code
        };

        const chat = <ChatType> {
            id: Number(message.chats.chat_id),
            type: message.chats.type
        };

        return <MessageType> {
            message_id: message.message_id ?? 0,
            from: from,
            chat: chat,
            date: message.date ?? 0,
            text: message.text ?? "",
            ttl: message.ttl ?? null,
            status: message.status ?? 1
        };
    });
}
