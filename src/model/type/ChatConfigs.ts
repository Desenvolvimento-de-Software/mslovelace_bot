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

export type ChatConfigs = {
    id: number,
    chat_id: number,
    greetings: number,
    goodbye: number,
    warn_name_changing: number,
    remove_event_messages: number,
    restrict_new_users: number,
    captcha: number,
    captcha_ban_seconds: number,
    warn_ask_to_ask: number,
    adashield: number,
    warnings?: number
};
