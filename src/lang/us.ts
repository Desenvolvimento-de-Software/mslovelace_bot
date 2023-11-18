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
    startMessage: "Hey! My name is Ada Lovelace. I used to be a programmer. The first programmer in the history, in fact.\n\nNow I'm here to help you get around and keep the order in your groups.\n\nI have lots of features, such as greetings, a warning system, a flood control system and even more!\n\n",
    startButton: "Add me to your group",
    helpButton: "Help",
    defaultGreetings: "Hey <a href=\"tg://user?id={userid}\">{username}</a>, welcome to this group! If you have any questions, please contact an admin.",
    greetingsStatus: "Greetings status: {status}",
    warnNameChanging: "<a href=\"tg://user?id={userid}\">{oldname}</a> changed their name to <a href=\"tg://user?id={userid}\">{newname}</a>",
    unauthorizedCommand: "<a href=\"tg://user?id={userid}\">{username}</a>, you are not supposed to send this command here.\nThis incident will be reported.",
    unauthorizedCommandReport: "The user <a href=\"tg://user?id={userid}\">{username}</a> is trying to send an unauthorized command in <a href=\"https://t.me/{chaturl}\">{chatname}</a>:\n<pre>{content}</pre>",
    groupStartMessage: "Hey <a href=\"tg://user?id={userid}\">{username}</a>! PM me if you want some help.",
    askToAskRegex: /(Any)\s(.*)\s(expert\s|dev\s)?(can\s)?(here|help)(.*)\??/i,
    askToAskLink: "https://dontasktoask.com",
    bannedMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banned.\nReason: {reason}",
    adaShieldMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banned.\nReason: AdaShield banned.",
    casMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banned.\nReason: <a href=\"https://cas.chat/\">CAS banned</a>.",
    adaShieldStatus: "AdaShield status: {status}",
    restrictStatus: "New users restriction status: {status}",
    textEnabled: "enabled",
    textDisabled: "disabled",
    captchaButton: "Press here to confirm you are not a robot",
    emptyGreetingsMessage: "There is no greetings message configured.",
    greetingsMessageDemo: "The current greetings message is:\n\n{greetings}",
    pongMessage: "Hey! It's me!",
    packageName: "📜 <code>{name}</code>",
    packageVersion: "📂 <code>{version}</code>",
    packageSize: "🗂️ <code>{size}</code>",
    packageDescription: "📝 {description}",
    packageDate: "📆 <code>{date}</code>",
    packageLinks: "🔗 Links:",
    packageLink: " • <a href=\"{linkurl}\">{linkname}</a>",
    packageHomepage: "Home Page",
    packageRepository: "🔗 Repositório:",
    packageAuthor: "👤 Author:",
    packagePublisher: "👤 Publisher:",
    packageMaintainers: "👥 Maintainers:",
    packagePerson: " • {person}",
    packageKeywords: "🏷 Keywords:",
    packageDependencies: "🖇 Dependencies:",
    packageDevDependencies: "🖇 Dev Dependencies:",
    npmPackageInstall: "⌨️ Install:\n<code>npm install {package}</code>",
    yarnPackageInstall: "⌨️ Install:\n<code>yarn add {package}</code>",
    playgroundLink: "🧪 Playground:\nhttps://npm.runkit.com/{package}",
    selfReportMessage: "Why would I report myself?",
    adminReportMessage: "Why would I report an admin?",
    selfWarnMessage: "Why would I warn myself?",
    adminWarnMessage: "Why would I warn an admin?",
    warningSigleMessage: "⚠️ <a href=\"tg://user?id={userid}\">{username}</a> has {warns} warnings.\n\nReason:\n",
    warningPluralMessage: "⚠️ <a href=\"tg://user?id={userid}\">{username}</a> has {warns} warnings.\n\nReasons:\n",
    warningBanMessage: "❌ <a href=\"tg://user?id={userid}\">{username}</a> has {warns} warnings and has been banned.\n\nReasons:\n",
    reportMessage: "Reported to the admins.",
    federationCreateOnlyPrivate: "PM me if you want to create a federation.",
    federationCreateSuccess: "Federation <code>{name}</code> successfully created.\nYou can now add groups to your federation using the command <code>/fjoin {hash}</code>.",
    federationCreateError: "An error occurred while creating the federation. Please try again later.",
    federationJoinOnlyAdminError: "Only admins can add this group to a federation.",
    federationJoinHasFederationError: "This group is already part of a federation. Please leave the federation with /fleave before joining another one.",
    federationJoinNoHashError: "You must provide a federation hash to join.",
    federationJoinAlreadyJoinedError: "This group is already part of this federation.",
    federationJoinError: "An error occurred while joining the federation. Please try again later.",
    federationJoinSuccess: "This group has been successfully added to the federation {federation}.",
    federationLeaveNoFederationError: "This group is not part of any federation.",
    federationLeaveError: "An error occurred while leaving the federation. Please try again later.",
    federationLeaveSuccess: "This group has been successfully removed from the federation.",
    federationCommandOnlyGroupError: "This command can only be used in groups.",
    federationCommandOnlyPrivateError: "This command can only be used in private.",
    federationListEmpty: "You have no federations.",
    federationListHeader: "Your federations:\n\n",
    federationListRow: " • <code>{hash}</code> - {description} ({groups} groups)\n",
    federationDeleteNoHashError: "You must provide a federation hash to delete.",
    federationInvalidHashError: "The provided hash is invalid.",
    federationNotOwnerError: "You are not the owner of this federation.",
    federationDeleteConfirm: "The federation {name} has {groups} attached groups.\nTo delete it, send <code>force</code> as the second parameter.\n\n<code>/fdelete {hash} force</code>",
    federationDeleteError: "An error occurred while deleting the federation. Please try again later.",
    federationDeleteSuccess: "The federation has been successfully deleted.",
    fedBannedMessage: "<a href=\"tg://user?id={userid}\">{username}</a> banned in federation.\nReason: {reason}",
    fedBanOnlyAdminError: "Only admins can ban users in a federation.",
    fedBanAdminError: "You can't ban admins in a federation.",
    macroNoMacroFound: "No macros found.\nTo add a macro, use the command <code>/madd</code> .",
    macroMalformedCommandError: "Malformed command. Please use the following syntax:\n<code>/madd {#name} {content}</code>",
    macroList: "The following macros are available:\n\n",
};
