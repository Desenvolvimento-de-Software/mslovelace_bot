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
import Captcha from "../command/Captcha.js";
import FederationBan from "../command/federation/Ban.js";
import FederationGroup from "../command/federation/Group.js";
import FederationManage from "../command/federation/Manage.js";
import FederationUser from "../command/federation/User.js";
import Greetings from "../command/Greetings.js";
import Kick from "../command/Kick.js";
import Macro from "../command/Macro.js";
import Npm from "../command/Npm.js";
import Ping from "../command/Ping.js";
import Privacy from "../command/Privacy.js";
import Report from "../command/Report.js";
import Restrict from "../command/Restrict.js";
import Rules from "../command/Rules.js";
import Send from "../command/Send.js";
import Start from "../command/Start.js";
import Unban from "../command/Unban.js";
import Warn from "../command/warning/Warn.js";
import Warnings from "../command/warning/Warnings.js";
import Yarn from "../command/Yarn.js";

export const commands = [
    AdaShield,
    Ask,
    Ban,
    Captcha,
    FederationBan,
    FederationGroup,
    FederationManage,
    FederationUser,
    Greetings,
    Kick,
    Macro,
    Npm,
    Ping,
    Privacy,
    Report,
    Restrict,
    Rules,
    Send,
    Start,
    Unban,
    Warn,
    Warnings,
    Yarn
];
