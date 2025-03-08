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

import { PrismaClient, bans } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Adds a ban.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param userId
 * @param chatId
 * @param reason
 *
 * @return The ban row.
 */
export async function addBan(userId: number, chatId: number, reason: string): Promise<bans|null> {

    return await prisma.bans.create({
        data: {
            user_id: userId,
            chat_id: chatId,
            reason: reason,
            date: Math.floor(Date.now() / 1000)
        }

    }).then(async (response) => {
        return response as bans | null;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });
}

/**
 * Adds a federation ban.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param userId
 * @param chatId
 * @param federationId
 * @param reason
 *
 * @return The ban row.
 */
export async function addFederationBan(userId: number, chatId: number, federationId: number, reason: string): Promise<bans|null> {

    return await prisma.bans.create({
        data: {
            user_id: userId,
            chat_id: chatId,
            federation_id: federationId,
            reason: reason,
            date: Math.floor(Date.now() / 1000)
        }

    }).then(async (response) => {
        return response as bans | null;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });
}
