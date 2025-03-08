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
import Context from "contexts/Context";
import User from "contexts/User";
import { PrismaClient } from "@prisma/client";
import { Chat as ChatType } from "libraries/telegram/types/Chat";
import { Message as MessageType } from "libraries/telegram/types/Message";
import { Update as UpdateType } from "libraries/telegram/types/Update";
import { User as UserType } from "libraries/telegram/types/User";

const prisma = new PrismaClient();

/**
 * Returns the context by the user and chat.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param userContext
 * @param chatContext
 *
 * @return {Promise<Context|null>}
 */
export const getContextByUserAndChat = async (userContext: User, chatContext: Chat): Promise<Context|null> => {

    if (!userContext.getId() || !chatContext.getId()) {
        return null;
    }

    const contextData = await prisma.rel_users_chats.findFirst({
        where: {
            user_id: userContext.getId(),
            chat_id: chatContext.getId()
        },
        include: {
            chats: true,
            users: true
        }

    }).then(async (response) => {
        prisma.$disconnect();
        return response;

    }).catch(async (e: Error) => {
        prisma.$disconnect();
        throw e;
    });

    if (!contextData) {
        return null;
    }

    const chat: ChatType = {
        id: Number(contextData.chats.chat_id),
        type: contextData.chats.type,
        title: contextData.chats.title
    };

    const user: UserType = {
        id: Number(contextData.users.user_id),
        is_bot: contextData.users.is_bot,
        first_name: contextData.users.first_name ?? "",
        last_name: contextData.users.last_name ?? "",
        username: contextData.users.username ?? "",
        language_code: contextData.users.language_code ?? ""
    };

    const message: MessageType = {
        message_id: 0,
        from: user,
        date: Math.floor(Date.now() / 1000),
        chat: chat,
        text: ""
    };

    const update: UpdateType = {
        update_id: 0,
        message: message
    };

    return new Context("message", update);
}
