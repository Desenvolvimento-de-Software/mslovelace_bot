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

export type Giveaway = {
    chats: Chat[];
    winners_selection_date: number;
    winner_count: number;
    only_new_members?: true;
    has_public_winners?: true;
    prize_description?: string;
    country_codes?: string[];
    prize_star_count?: number;
    premium_subscription_month_count?: number;
};
