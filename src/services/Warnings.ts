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
import User from "contexts/User";
import { getChatByTelegramId } from "./Chats";
import { getUserByTelegramId } from "./Users";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns the user warnings.
 *
 * @author Marcos Leandro
 * @since  2023-08-09
 *
 * @param userContext
 * @param chatContext
 *
 * @return User warnings.
 */
export async function getUserWarnings(userContext: User, chatContext: Chat) {

    if (!userContext.getId() || !chatContext.getId()) {
        throw Error("User and chat must be defined.");
    }

    const user = await getUserByTelegramId(userContext.getId());
    const chat = await getChatByTelegramId(chatContext.getId());
    if (!user || !chat) {
        throw Error("User or chat not found.");
    }

    return await prisma.warnings.findMany({
        where: {
            user_id: user.id,
            chat_id: chat.id
        }

    }).then(async (response) => {
        prisma.$disconnect();
        return response;

    }).catch(async (e: Error) => {
        prisma.$disconnect();
        throw e;
    });;
}

/**
 * Adds a warning to the user.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param userContext
 * @param chatContext
 * @param reason
 *
 * @return The warning.
 */
export async function addWarning(userContext: User, chatContext: Chat, reason: string) {

    if (!userContext.getId() || !chatContext.getId()) {
        throw Error("User and chat must be defined.");
    }

    const user = await getUserByTelegramId(userContext.getId());
    const chat = await getChatByTelegramId(chatContext.getId());
    if (!user || !chat) {
        throw Error("User or chat not found.");
    }

    return await prisma.warnings.create({
        data: {
            user_id: user.id,
            chat_id: chat.id,
            date: Math.floor(Date.now() / 1000),
            reason: reason
        }

    }).then(async (response) => {
        prisma.$disconnect();
        return response;

    }).catch(async (e: Error) => {
        prisma.$disconnect();
        throw e;
    });;
}
