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

import { Chat } from "./Chat";
import { User } from "./User";

export type MessageOrigin = {
    type: string;
    date: number;
};

export type MessageOriginUser = MessageOrigin & {
    sender_user: User;
};

export type MessageOriginHiddenUser = MessageOrigin & {
    sender_user_name: string;
};

export type MessageOriginChat = MessageOrigin & {
    sender_chat: Chat;
    author_signature?: string;
};

export type MessageOriginChannel = MessageOrigin & {
    chat: Chat;
    message_id: number;
    author_signature?: string;
};
