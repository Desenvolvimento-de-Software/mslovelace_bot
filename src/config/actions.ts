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
import AskToAskAction from "../action/AskToAsk";
import CheckRestriction from "../action/CheckRestriction";
import NewChatMember from "../action/NewChatMember";
import LeftChatMember from "../action/LeftChatMember";
import Ping from "../action/Ping";
import saveUserAndChat from "../action/SaveUserAndChat";

export const actions = [
    saveUserAndChat,
    AdaShield,
    AskToAskAction,
    CheckRestriction,
    NewChatMember,
    LeftChatMember,
    Ping
];
