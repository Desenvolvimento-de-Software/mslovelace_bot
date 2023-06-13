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

import { KeyboardButtonPollType } from "./KeyboardButtonPollType.js";
import { KeyboardButtonRequestChat } from "./KeyboardButtonRequestChat.js";
import { KeyboardButtonRequestUser } from "./KeyboardButtonRequestUser.js";
import { WebAppInfo } from "./WebAppInfo.js";

export type KeyboardButton = {
    text: string;
    requestUser?: KeyboardButtonRequestUser;
    requestChat?: KeyboardButtonRequestChat;
    requestContact?: boolean;
    requestLocation?: boolean;
    requestPoll?: KeyboardButtonPollType;
    webApp?: WebAppInfo;
};
