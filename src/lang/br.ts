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
    startButton : "Adicione-me ao seu grupo",
    helpButton : "Ajuda",
    defaultGreetings : "Olá <a href=\"tg://user?id={userid}\">{username}</a>, te desejo as boas-vindas ao grupo! Em caso de dúvidas, por favor contate um administrador.",
    commandGreetingsActivated : "Saudações ativadas",
    commandGreetingsDeactivated : "Saudações desativadas",
    warnNameChanging : "<a href=\"tg://user?id={userid}\">{oldname}</a> mudou seu nome para <a href=\"tg://user?id={userid}\">{newname}</a>",
    unauthorizedCommand : "<a href=\"tg://user?id={userid}\">{username}</a>, você não está autorizado a enviar este comando aqui.\nEste incidente será reportado.",
    unauthorizedCommandReport : "O usuário <a href=\"tg://user?id={userid}\">{username}</a> está tentando enviar um comando não autorizado em <a href=\"https://t.me/{chaturl}\">{chatname}</a>:\n<pre>{content}</pre>",
    groupStartMessage : "Olá <a href=\"tg://user?id={userid}\">{username}</a>! Me chame no privado se precisar de ajuda.",
    askToAskRegex : /^(algu[eé]?m|preciso)\s(tem|a[kqu]+[ií]\s)?([doesnt]+ grupo\s)?(.*)?(ajuda|duvida|sabe|manja|entende|conhe[cs]|usa|help|m[aã]o|for[cç]a|me[xch]+e)(.*)\??/i,
    askToAskLink : "https://dontasktoask.com/pt-br",
    adaShieldMessage : "<a href=\"tg://user?id={userid}\">{username}</a> banido. Motivo: AdaShield."
};
