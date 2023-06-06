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

import AskToAskAction from "../action/AskToAsk.js";
import CheckRestriction from "../action/CheckRestriction.js";
import NewChatMember from "../action/NewChatMember.js";
import LeftChatMember from "../action/LeftChatMember.js";
import Ping from "../action/Ping.js";
import CaptchaConfirmationCallback from "../controller/callback/CaptchaConfirmation.js";
import AdaShieldCommand from "../command/AdaShield.js";
import AskCommand from "../command/Ask.js";
import BanCommand from "../command/Ban.js";
import GreetingsCommand from "../command/Greetings.js";
import KickCommand from "../command/Kick.js";
import NpmCommand from "../command/Npm.js";
import RestrictCommand from "../command/Restrict.js";
import SendCommand from "../command/Send.js";
import StartCommand from "../command/Start.js";
import UnbanCommand from "../command/Unban.js";
import YarnCallback from "../controller/callback/Yarn.js";
import YarnCommand from "../command/Yarn.js";

export const resources = [
    AskToAskAction,
    CheckRestriction,
    NewChatMember,
    LeftChatMember,
    Ping,
    CaptchaConfirmationCallback,
    AdaShieldCommand,
    AskCommand,
    BanCommand,
    GreetingsCommand,
    KickCommand,
    NpmCommand,
    RestrictCommand,
    SendCommand,
    StartCommand,
    UnbanCommand,
    YarnCallback,
    YarnCommand
];
