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

export default {
    defaultGreetings : "Hey <a href=\"tg://user?id={userid}\">{username}</a>, welcome to this group! If you have any questions, please contact an admin.",
    commandGreetingsActivated : "Greetings activated",
    commandGreetingsDeactivated : "Greetings deactivated",
    warnNameChanging : "<a href=\"tg://user?id={userid}\">{oldname}</a> changed their name to <a href=\"tg://user?id={userid}\">{newname}</a>",
    unauthorizedCommand : "<a href=\"tg://user?id={userid}\">{username}</a>, you are not supposed to send this command here.\nThis incident will be reported.",
    unauthorizedCommandReport : "The user <a href=\"tg://user?id={userid}\">{username}</a> is trying to send an unauthorized command in <a href=\"https://t.me/{chaturl}\">{chatname}</a>:\n<pre>{content}</pre>"
};
