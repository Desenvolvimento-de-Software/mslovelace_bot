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

export type ReactionType = {
    type: string;
};

export type ReactionTypePaid = ReactionType;

export type ReactionTypemoji = ReactionType & {
    emoji: string;
};

export type ReactionTypeCustomEmoji = ReactionType & {
    custom_emoji_id: string;
};
