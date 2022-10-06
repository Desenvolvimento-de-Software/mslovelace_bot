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
    startMessage : "Hey! My name is Ada Lovelace. I used to be a programmer. The first programmer in the history, in fact.\n\nNow I'm here to help you get around and keep the order in your groups.\nI have lots of features, such as greetings, a warning system, a flood control system and even more!\n\n",
    startButton : "Add me to your group",
    helpButton : "Help",
    defaultGreetings : "Hey <a href=\"tg://user?id={userid}\">{username}</a>, welcome to this group! If you have any questions, please contact an admin.",
    commandGreetingsActivated : "Greetings activated",
    commandGreetingsDeactivated : "Greetings deactivated",
    warnNameChanging : "<a href=\"tg://user?id={userid}\">{oldname}</a> changed their name to <a href=\"tg://user?id={userid}\">{newname}</a>",
    unauthorizedCommand : "<a href=\"tg://user?id={userid}\">{username}</a>, you are not supposed to send this command here.\nThis incident will be reported.",
    unauthorizedCommandReport : "The user <a href=\"tg://user?id={userid}\">{username}</a> is trying to send an unauthorized command in <a href=\"https://t.me/{chaturl}\">{chatname}</a>:\n<pre>{content}</pre>",
    groupStartMessage : "Hey <a href=\"tg://user?id={userid}\">{username}</a>! PM me if you want some help.",
    askToAskRegex : /(Any)\s(.*)\s(expert\s|dev\s)?(can\s)?(here|help)(.*)\??/i,
    askToAskLink : "https://dontasktoask.com",
    adaShieldMessage : "<a href=\"tg://user?id={userid}\">{username}</a> banned. Reason: AdaShield banned.",
    casMessage : "<a href=\"tg://user?id={userid}\">{username}</a> banned. Reason: <a href=\"https://cas.chat/\">CAS banned</a>.",
    adaShieldStatus : "AdaShield status: {status}",
    textEnabled : "enabled",
    textDisabled : "disabled",
    captchaButton : "Press here to confirm you are not a robot",
    emptyGreetingsMessage : "There is no greetings message configured.",
    greetingsMessageDemo : "The current greetings message is:\n\n{greetings}",
    pongMessage : "Hey! It's me!",
    npmPackageName : "📜 <code>{name}</code>\n",
    npmPackageVersion : "📂 <code>{version}</code>\n",
    npmPackageDescription : "📝 {description}\n",
    npmPackageDate : "📆 <code>{date}</code>\n",
    npmPackageLinks : "🔗 Links:\n",
    npmPackageLink : " • <a href=\"{linkurl}\">{linkname}</a>\n",
    npmAuthor : "👤 Author:\n",
    npmPublisher : "👤 Publisher:\n",
    npmMaintainers : "👥 Maintainers:\n",
    npmPerson : " • {person}\n",
    npmPackageKeywords : "🏷 Keywords:\n",
    npmPackageInstall : "⌨️ Install:\n<code>npm install {package}</code>",
    playgroundLink : "🧪 Playground:\nhttps://npm.runkit.com/{package}"
};
