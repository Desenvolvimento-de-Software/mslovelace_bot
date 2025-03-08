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

import Chat from "contexts/Chat";
import { ChatWithConfigs } from "types/ChatWithConfigs";
import { PrismaClient, chat_messages, chat_rules, chats } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns the chat by it's ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param telegramChatId
 */
export async function getChatById(chatId: number): Promise<ChatWithConfigs|null> {
    return await get({ id: chatId });
}

/**
 * Returns the chat by it's Telegram ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param chatId
 */
export async function getChatByTelegramId(telegramChatId: number): Promise<ChatWithConfigs|null> {
    return await get({ chat_id: telegramChatId });
};

/**
 * Returns the chat rules by it's chat ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param chatId
 */
export async function getChatRulesByChatId(chatId: number): Promise<chat_rules|null> {

    return await prisma.chat_rules.findFirst({
        where: { chat_id: chatId }

    }).then(response => response).catch(async (err: Error) => {
        throw err;

    }).finally(() => {
        prisma.$disconnect();
    });
}

/**
 * Returns the chat messages by it's chat ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param chatId
 */
export async function getChatMessagesByChatId(chatId: number): Promise<chat_messages|null> {

    return await prisma.chat_messages.findFirst({
        where: { chat_id: chatId }

    }).then(response => response).catch(async (err: Error) => {
        throw err;

    }).finally(() => {
        prisma.$disconnect();
    });
}

/**
 * Returns a chat, creating it if it doesn't exist.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param chat
 *
 * @return Chat object.
 */
export async function createAndGetChat(chat: Chat): Promise<chats> {

    return await prisma.chats.upsert({
        where: { chat_id: chat.getId() },
        update: {
            title: chat.getTitle(),
            type: chat.getType(),
            language: "en"
        },
        create: {
            chat_id: chat.getId(),
            title: chat.getTitle() ?? "Unknown",
            type: chat.getType(),
            language: "en",
            joined: true
        }

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });
}

/**
 * Queries the database for a chat.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param where
 */
async function get(where: Parameters<typeof prisma.chats.findUnique>[0]['where']): Promise<ChatWithConfigs|null> {

    return await prisma.chats.findUnique({
        where: where,
        include: {
            chat_configs: true
        }

    }).then(async (response) => {
        return response as ChatWithConfigs|null;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });
}
