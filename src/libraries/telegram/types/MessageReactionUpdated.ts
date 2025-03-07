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
import { ReactionTypemoji, ReactionTypeCustomEmoji, ReactionTypePaid } from "./ReactionType";

export type MessageReactionUpdated = {
    chat: Chat;
    message_id: number,
    user?: User;
    actor_chat?: Chat;
    date: number;
    old_reaction: ReactionTypemoji|ReactionTypeCustomEmoji|ReactionTypePaid;
    new_reaction: ReactionTypemoji|ReactionTypeCustomEmoji|ReactionTypePaid;
};
