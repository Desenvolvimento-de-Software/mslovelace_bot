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

import { PrismaClient, rel_users_chats } from "@prisma/client";
import { RelUserAndChat as RelUserAndChatType } from "types/UserAndChat";
import { getChatByTelegramId } from "./Chats";
import { getUserByTelegramId } from "./Users";

const prisma = new PrismaClient();

/**
 * Returns the user and chat data.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param chatId
 *
 * @return User and Chat object.
 */
export async function getUserAndChatByTelegramId(telegramUserId: number, telegramChatId: number): Promise<RelUserAndChatType|null> {

    const user = await getUserByTelegramId(telegramUserId);
    const chat = await getChatByTelegramId(telegramChatId);

    const result = await prisma.rel_users_chats.findFirst({
        where: {
            user_id: user?.id,
            chat_id: chat?.id
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
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return result as RelUserAndChatType ?? null;
}

/**
 * Joins the user in chat.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param userId
 * @param chatId
 * @param checked
 *
 * @return User and Chat object.
 */
export async function join(userId: number, chatId: number, checked: boolean, ttl: number|null): Promise<rel_users_chats> {

    const result = await prisma.rel_users_chats.upsert({
        where: {
            user_id_chat_id: {
                user_id: userId,
                chat_id: chatId
            }
        },
        update: {
            joined: true,
            checked: checked,
            date: Math.floor(Date.now() / 1000),
            last_seen: Math.floor(Date.now() / 1000),
            ttl: ttl
        },
        create: {
            user_id: userId,
            chat_id: chatId,
            joined: true,
            checked: checked,
            date: Math.floor(Date.now() / 1000),
            last_seen: Math.floor(Date.now() / 1000),
            ttl: ttl
        }

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(async () => {
        prisma.$disconnect();
    });

    return result;
}

/**
 * Leaves the user from chat.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param userId
 * @param chatId
 * @param checked
 *
 * @return User and Chat object.
 */
export async function leave(userId: number, chatId: number) {

    const result = await prisma.rel_users_chats.update({
        where: {
            user_id_chat_id: {
                user_id: userId,
                chat_id: chatId
            }
        },
        data: {
            joined: false,
            captcha: null,
            ttl: null
        }

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(async () => {
        prisma.$disconnect();
    });

    return result;
}

/**
 * Approves the user on the chat.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param userId
 * @param chatId
 */
export async function approveOnChat(userId: number, chatId: number): Promise<void> {

    await prisma.rel_users_chats.update({
        where: {
            user_id_chat_id: {
                user_id: userId,
                chat_id: chatId
            }
        },
        data: {
            checked: true
        }

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(async () => {
        prisma.$disconnect();
    });
}
