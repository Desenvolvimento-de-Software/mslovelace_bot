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

import AdaShieldCommand from "../command/AdaShield";
import AskCommand from "../command/Ask";
import BanCommand from "../command/Ban";
// import GreetingsCommand from "../command/Greetings";
// import KickCommand from "../command/Kick";
// import NpmCommand from "../command/Npm";
// import RestrictCommand from "../command/Restrict";
// import SendCommand from "../command/Send";
// import StartCommand from "../command/Start";
// import UnbanCommand from "../command/Unban";
// import YarnCommand from "../command/Yarn";

export const commands = [
    AdaShieldCommand,
    AskCommand,
    BanCommand,
    // GreetingsCommand,
    // KickCommand,
    // NpmCommand,
    // RestrictCommand,
    // SendCommand,
    // StartCommand,
    // UnbanCommand,
    // YarnCommand
];
