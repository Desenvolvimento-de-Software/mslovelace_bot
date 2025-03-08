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

import { PrismaClient } from "@prisma/client";
import { Chat as ChatType } from "libraries/telegram/types/Chat";
import { Message as MessageType } from "libraries/telegram/types/Message";
import { User as UserType } from "libraries/telegram/types/User";

const prisma = new PrismaClient();

/**
 * Returns the messages with expired TTL.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @return {Promise<MessageType[]>}
 */
export const getOldMessages = async (): Promise<MessageType[]> => {

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const oldMessages = await prisma.messages.findMany({
        where: {
            ttl: {
                not: null,
                lt: currentTimestamp
            },
            status: true
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

    if (!oldMessages) {
        return [];
    }

    return oldMessages.map((message) => {
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
            message_id: message.message_id,
            from: from,
            chat: chat,
            date: message.date,
            text: message.content,
            ttl: message.ttl,
            status: message.status
        };
    });
};

/**
 * Updates the messages with expired TTL to status false.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param messages
 *
 * @return {Promise<void>}
 */
export const disableOldMessages = async (messages: MessageType[]): Promise<void> => {

    const messageIds = messages.map((message) => message.message_id);
    const params = {
        where: {
            message_id: {
                in: messageIds
            }
        },
        data: {
            status: false
        }
    };

    await prisma.messages.updateMany(params).then(async (response) => {
        prisma.$disconnect();
        return response;

    }).catch(async (e: Error) => {
        prisma.$disconnect();
        throw e;
    });
}
