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

export type User = {
    id: number,
    user_id: number,
    username?: string,
    first_name?: string,
    last_name?: string,
    is_channel: number,
    is_bot: number,
    is_premium: number,
    language_code?: string
};
