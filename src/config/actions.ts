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

import AdaShield from "../action/AdaShield.js";
import AskToAsk from "../action/AskToAsk.js";
import Captcha from "../action/Captcha.js";
import Greetings from "../action/Greetings.js";
import NewChatMember from "../action/NewChatMember.js";
import LeftChatMember from "../action/LeftChatMember.js";
import Ping from "../action/Ping.js";
import SaveMessage from "../action/SaveMessage.js";
import SaveUserAndChat from "../action/SaveUserAndChat.js";
import Report from "../action/Report.js";

export const actions = [
    SaveUserAndChat,
    SaveMessage,
    AdaShield,
    Captcha,
    Greetings,
    AskToAsk,
    NewChatMember,
    LeftChatMember,
    Ping,
    Report
];
