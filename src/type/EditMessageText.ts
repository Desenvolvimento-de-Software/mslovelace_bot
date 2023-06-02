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

export type EditMessageTextType = {
chat_id?: number,
message_id?: number,
inline_message_id?: number,
text?: string,
parse_mode?: string,
entities?: Array<any>,
disable_web_page_preview?: boolean,
reply_markup?: any
}
