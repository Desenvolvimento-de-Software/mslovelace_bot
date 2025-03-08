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

import { PrismaClient, macros } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns the macro by chat id and text.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param chatId
 * @param text
 *
 * @return The macro row.
 */
export async function getMacroByChatIdAndMacro(chatId: number, text: string): Promise<macros|null> {

    const macro = await prisma.macros.findFirst({
        where: { chat_id: chatId, macro: text }

    }).then((response) => {
        return response;

    }).catch((e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return macro ?? null;
}

/**
 * Returns the macros for a given chat ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param chatId
 *
 * @return The macros list.
 */
export async function getMacrosByChatId(chatId: number): Promise<macros[]> {

    const macros = await prisma.macros.findMany({
        where: { chat_id: chatId }

    }).then((response) => {
        return response;

    }).catch((e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return macros ?? [];
}

/**
 * Adds the macro to the chat.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param chatId
 * @param macro
 * @param content
 *
 * @return The new macro row.
 */
export async function addMacroToChat(chatId: number, macro: string, content: string): Promise<macros> {

    const newMacro = await prisma.macros.create({
        data: {
            chat_id: chatId,
            macro: macro,
            content: content
        }

    }).then((response) => {
        return response;

    }).catch((e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return newMacro;
}

/**
 * Removes the macro from chat.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param macroId
 */
export async function removeMacro(macroId: number): Promise<void> {

    await prisma.macros.delete({
        where: { id: macroId }

    }).catch((e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });
}
