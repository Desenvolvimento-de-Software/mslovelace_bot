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
import YarnCommand from "../command/Yarn.js";

export const commands = [
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
    YarnCommand
];
