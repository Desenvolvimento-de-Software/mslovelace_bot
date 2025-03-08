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

import AdaShield from "../commands/AdaShield";
import Approve from "commands/Approve";
import Ask from "../commands/Ask";
import Ban from "../commands/Ban";
import Captcha from "../commands/Captcha";
import Events from "commands/Events";
import FederationBan from "../commands/federation/Ban";
import FederationGroup from "../commands/federation/Group";
import FederationManage from "../commands/federation/Manage";
import FederationUser from "../commands/federation/User";
import Greetings from "../commands/Greetings";
import Kick from "../commands/Kick";
import Macro from "../commands/Macro";
import Npm from "../commands/Npm";
import Ping from "../commands/Ping";
import Privacy from "../commands/Privacy";
import Report from "../commands/Report";
import Restrict from "../commands/Restrict";
import Rules from "../commands/Rules";
import Send from "../commands/Send";
import Start from "../commands/Start";
import Unban from "../commands/Unban";
import Warn from "../commands/warning/Warn";
import Warnings from "../commands/warning/Warnings";
import Yarn from "../commands/Yarn";

export const commands = [
    AdaShield,
    Approve,
    Ask,
    Ban,
    Captcha,
    Events,
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
