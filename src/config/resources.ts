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

import AskToAskAction from "../controller/action/AskToAsk.js";
import CheckRestriction from "../controller/action/CheckRestriction.js";
import NewChatMember from "../controller/action/NewChatMember.js";
import LeftChatMember from "../controller/action/LeftChatMember.js";
import Ping from "../controller/action/Ping.js";
import CaptchaConfirmationCallback from "../controller/callback/CaptchaConfirmation.js";
import AdaShieldCommand from "../controller/command/AdaShield.js";
import AskCommand from "../controller/command/Ask.js";
import BanCommand from "../controller/command/Ban.js";
import GreetingsCommand from "../controller/command/Greetings.js";
import KickCommand from "../controller/command/Kick.js";
import NpmCommand from "../controller/command/Npm.js";
import RestrictCommand from "../controller/command/Restrict.js";
import SendCommand from "../controller/command/Send.js";
import StartCommand from "../controller/command/Start.js";
import UnbanCommand from "../controller/command/Unban.js";
import YarnCallback from "../controller/callback/Yarn.js";
import YarnCommand from "../controller/command/Yarn.js";

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
