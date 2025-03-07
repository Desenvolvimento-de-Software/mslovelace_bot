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

import AdaShield from "../actions/AdaShield";
import AskToAsk from "../actions/AskToAsk";
import Captcha from "../actions/Captcha";
import Greetings from "../actions/Greetings";
import NewChatMember from "../actions/NewChatMember";
import LeftChatMember from "../actions/LeftChatMember";
import Ping from "../actions/Ping";
import SaveMessage from "../actions/SaveMessage";
import SaveUserAndChat from "../actions/SaveUserAndChat";
import Report from "../actions/Report";

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
