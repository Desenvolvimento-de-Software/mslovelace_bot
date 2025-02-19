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

import AdaShield from "../command/AdaShield";
import Ask from "../command/Ask";
import Ban from "../command/Ban";
import Captcha from "../command/Captcha";
import FederationBan from "../command/federation/Ban";
import FederationGroup from "../command/federation/Group";
import FederationManage from "../command/federation/Manage";
import FederationUser from "../command/federation/User";
import Greetings from "../command/Greetings";
import Kick from "../command/Kick";
import Macro from "../command/Macro";
import Npm from "../command/Npm";
import Ping from "../command/Ping";
import Privacy from "../command/Privacy";
import Report from "../command/Report";
import Restrict from "../command/Restrict";
import Rules from "../command/Rules";
import Send from "../command/Send";
import Start from "../command/Start";
import Unban from "../command/Unban";
import Warn from "../command/warning/Warn";
import Warnings from "../command/warning/Warnings";
import Yarn from "../command/Yarn";

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
