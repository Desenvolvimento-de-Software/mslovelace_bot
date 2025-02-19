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

import { CallbackGame } from "./CallbackGame";
import { LoginUrl } from "./LoginUrl";
import { SwitchInlineQueryChosenChat } from "./SwitchInlineQueryChosenChat";
import { WebAppInfo } from "./WebAppInfo";

export type InlineKeyboardButton = {
    text: string;
    url?: string;
    callback_data?: string;
    web_app?: WebAppInfo;
    login_url?: LoginUrl;
    switch_inline_query?: string;
    switch_inline_query_current_chat?: string;
    switch_inline_query_chosen_chat?: SwitchInlineQueryChosenChat;
    callback_game?: CallbackGame;
    pay?: boolean;
};
