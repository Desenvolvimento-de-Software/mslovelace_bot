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

import AdaShield from "../command/AdaShield.js";
import Ask from "../command/Ask.js";
import Ban from "../command/Ban.js";
import Greetings from "../command/Greetings.js";
import Kick from "../command/Kick.js";
import Npm from "../command/Npm.js";
import Report from "../command/Report.js";
import Restrict from "../command/Restrict.js";
import Send from "../command/Send.js";
import Start from "../command/Start.js";
import Unban from "../command/Unban.js";
import Warn from "../command/Warn.js";
import Yarn from "../command/Yarn.js";

export const commands = [
    AdaShield,
    Ask,
    Ban,
    Greetings,
    Kick,
    Npm,
    Report,
    Restrict,
    Send,
    Start,
    Unban,
    Warn,
    Yarn
];
