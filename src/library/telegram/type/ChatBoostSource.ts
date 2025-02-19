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

import { User } from "./User";

export type ChatBoostSource = {
    source: string;
    user: User;
};

export type ChatBoostSourceGiftCode = ChatBoostSource;

export type ChatBoostSourcePremium = ChatBoostSource;

export type ChatBoostSourceGiveaway = ChatBoostSource & {
    giveaway_message_id: number;
    prize_star_count?: number;
    is_unclaimed?: true;
};
