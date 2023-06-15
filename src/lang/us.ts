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
    startMessage : "Hey! My name is Ada Lovelace. I used to be a programmer. The first programmer in the history, in fact.\n\nNow I'm here to help you get around and keep the order in your groups.\n\nI have lots of features, such as greetings, a warning system, a flood control system and even more!\n\n",
    startButton : "Add me to your group",
    helpButton : "Help",
    defaultGreetings : "Hey <a href=\"tg://user?id={userid}\">{username}</a>, welcome to this group! If you have any questions, please contact an admin.",
    greetingsStatus : "Greetings status: {status}",
    warnNameChanging : "<a href=\"tg://user?id={userid}\">{oldname}</a> changed their name to <a href=\"tg://user?id={userid}\">{newname}</a>",
    unauthorizedCommand : "<a href=\"tg://user?id={userid}\">{username}</a>, you are not supposed to send this command here.\nThis incident will be reported.",
    unauthorizedCommandReport : "The user <a href=\"tg://user?id={userid}\">{username}</a> is trying to send an unauthorized command in <a href=\"https://t.me/{chaturl}\">{chatname}</a>:\n<pre>{content}</pre>",
    groupStartMessage : "Hey <a href=\"tg://user?id={userid}\">{username}</a>! PM me if you want some help.",
    askToAskRegex : /(Any)\s(.*)\s(expert\s|dev\s)?(can\s)?(here|help)(.*)\??/i,
    askToAskLink : "https://dontasktoask.com",
    adaShieldMessage : "<a href=\"tg://user?id={userid}\">{username}</a> banned. Reason: AdaShield banned.",
    casMessage : "<a href=\"tg://user?id={userid}\">{username}</a> banned. Reason: <a href=\"https://cas.chat/\">CAS banned</a>.",
    adaShieldStatus : "AdaShield status: {status}",
    restrictStatus : "New users restriction status: {status}",
    textEnabled : "enabled",
    textDisabled : "disabled",
    captchaButton : "Press here to confirm you are not a robot",
    emptyGreetingsMessage : "There is no greetings message configured.",
    greetingsMessageDemo : "The current greetings message is:\n\n{greetings}",
    pongMessage : "Hey! It's me!",
    packageName : "📜 <code>{name}</code>",
    packageVersion : "📂 <code>{version}</code>",
    packageSize : "🗂️ <code>{size}</code>",
    packageDescription : "📝 {description}",
    packageDate : "📆 <code>{date}</code>",
    packageLinks : "🔗 Links:",
    packageLink : " • <a href=\"{linkurl}\">{linkname}</a>",
    packageHomepage : "Home Page",
    packageRepository : "🔗 Repositório:",
    packageAuthor : "👤 Author:",
    packagePublisher : "👤 Publisher:",
    packageMaintainers : "👥 Maintainers:",
    packagePerson : " • {person}",
    packageKeywords : "🏷 Keywords:",
    packageDependencies : "🖇 Dependencies:",
    packageDevDependencies : "🖇 Dev Dependencies:",
    npmPackageInstall : "⌨️ Install:\n<code>npm install {package}</code>",
    yarnPackageInstall : "⌨️ Install:\n<code>yarn add {package}</code>",
    playgroundLink : "🧪 Playground:\nhttps://npm.runkit.com/{package}",
    selfReportMessage : "Why would I report myself?",
    adminReportMessage : "Why would I report an admin?",
    selfWarnMessage : "Why would I warn myself?",
    adminWarnMessage : "Why would I warn an admin?",
    warningSigleMessage : "⚠️ <a href=\"tg://user?id={userid}\">{username}</a> has {warns} warning.\n\nReason:\n",
    warningPluralMessage : "⚠️ <a href=\"tg://user?id={userid}\">{username}</a> has {warns} warnings.\n\nReasons:\n",
    warningBanMessage : "❌ <a href=\"tg://user?id={userid}\">{username}</a> has {warns} warnings and has been banned.\n\nReasons:\n",
    reportMessage: "Reported to the admins."
};
