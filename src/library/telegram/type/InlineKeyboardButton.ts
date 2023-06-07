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

import { CallbackGame } from "./games/CallbackGame";
import { LoginUrl } from "./LoginUrl";
import { SwitchInlineQueryChosenChat } from "./SwitchInlineQueryChosenChat";
import { WebAppInfo } from "./WebAppInfo";

export type InlineKeyboardButton = {
    text: string;
    url?: string;
    callbackData?: string;
    webApp?: WebAppInfo;
    loginUrl?: LoginUrl;
    switchInlineQuery?: string;
    switchInlineQueryCurrentChat?: string;
    switchInlineQueryChosenChat?: SwitchInlineQueryChosenChat;
    callbackGame?: CallbackGame;
    pay?: boolean;
};
