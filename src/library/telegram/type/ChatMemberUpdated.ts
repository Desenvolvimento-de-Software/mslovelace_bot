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
import { ChatMember } from "./ChatMember.js";
import { User } from "./User.js";

export type ChatMemberUpdated = {
    chat: Chat;
    from: User;
    date: number;
    old_chat_member: ChatMember;
    new_chat_member: ChatMember;
    invite_link?: ChatInviteLink;
    via_join_request?: boolean;
    via_chat_folder_invite_link?: boolean;
};
