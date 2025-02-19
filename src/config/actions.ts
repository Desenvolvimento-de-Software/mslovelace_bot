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

import AdaShield from "../action/AdaShield";
import AskToAsk from "../action/AskToAsk";
import Captcha from "../action/Captcha";
import Greetings from "../action/Greetings";
import NewChatMember from "../action/NewChatMember";
import LeftChatMember from "../action/LeftChatMember";
import Ping from "../action/Ping";
import SaveMessage from "../action/SaveMessage";
import SaveUserAndChat from "../action/SaveUserAndChat";
import Report from "../action/Report";

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
