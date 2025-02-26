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

export type Message = {
    id: number,
    user_id: number,
    chat_id: number,
    thread_id?: number,
    message_id: number,
    type: string,
    reply_to?: number,
    content?: string,
    callback_query?: string,
    entities?: string,
    animation?: string,
    audio?: string,
    document?: string,
    photo?: string,
    sticker?: string,
    video?: string,
    video_note?: string,
    voice?: string,
    caption?: string,
    caption_entities?: string,
    date: number,
    ttl?: number,
    status?: number,
};
