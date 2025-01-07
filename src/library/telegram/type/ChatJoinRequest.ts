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

import { Chat } from "./Chat.js";
import { ChatInviteLink } from "./ChatInviteLink.js";
import { User } from "./User.js";

export type ChatJoinRequest = {
    chat: Chat;
    from: User;
    user_chat_id: number;
    date: number;
    bio?: string;
    invite_link?: ChatInviteLink;
};
