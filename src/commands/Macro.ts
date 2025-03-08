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

import Command from "./Command";
import Context from "contexts/Context";
import CommandContext from "contexts/Command";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { getChatByTelegramId } from "services/Chats";
import {
    addMacroToChat,
    getMacroByChatIdAndMacro,
    getMacrosByChatId,
    removeMacro
} from "services/Macros";

export default class Macro extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command : "macro", description : "Shows a macro with [macro name]." },
        { command : "madd", description : "Adds a macro with [madd name content]." },
        { command : "mlist", description : "Lists the macros." },
        { command : "mremove", description : "Removes a macro with [mremove name]." }
    ];

    /**
     * Current loaded chat.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     */
    private chat: Record<string, any> = {};

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     */
    public constructor() {
        super();
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        this.context?.getMessage()?.delete();

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        this.chat = chat;

        let action = "index";
        if (Macro.prototype.hasOwnProperty(command.getCommand())) {
            action = command.getCommand();
        }

        const method = action as keyof Macro;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }
    }

    /**
     * Shows a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private async index(command: CommandContext): Promise<void> {

        const params = command.getParams();
        if (!Array.isArray(params) || params.length < 1) {
            return;
        }

        const content = params.shift()?.trim();
        if (!content?.length) {
            return;
        }

        const macro = await getMacroByChatIdAndMacro(this.chat.id, content);
        if (!macro?.content) {
            return;
        }

        const replyToMessage = this.context?.getMessage()?.getReplyToMessage();
        if (replyToMessage) {
            replyToMessage.reply(macro.content, { parse_mode : "HTML" });
            return;
        }

        this.context?.getChat()?.sendMessage(macro.content, { parse_mode : "HTML" });
    }

    /**
     * Adds a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private async madd(command: CommandContext): Promise<void> {

        if (!await this.context?.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        let params = command.getParams();
        if (!Array.isArray(params) || params.length < 2) {
            this.context?.getChat()?.sendMessage(Lang.get("macroMalformedCommandError"), { parse_mode : "HTML" });
            return Promise.resolve();
        }

        const macro = params.shift()?.trim();
        const content = params.join(" ").trim();

        if (!macro?.length || !content.length) {
            this.context?.getChat()?.sendMessage(Lang.get("macroMalformedCommandError"), { parse_mode : "HTML" });
            return Promise.resolve();
        }

        const existingMacro = await getMacroByChatIdAndMacro(this.chat.id, macro.toLocaleLowerCase());
        if (existingMacro?.content) {
            const alreadyExistLang = Lang.get("macroAlreadyExists").replace("{macro}", macro);
            this.context?.getChat()?.sendMessage(alreadyExistLang, { parse_mode : "HTML" });
            return Promise.resolve();
        }

        await addMacroToChat(this.chat.id, macro.toLowerCase(), content).catch(err => {
            Log.save(err.mesage, err.stack);
            this.context?.getChat()?.sendMessage(Lang.get("macroAddError"), { parse_mode : "HTML" });
        });

        this.mlist(command);
    }

    /**
     * Lists the macros.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private async mlist(command: CommandContext): Promise<void> {

        await getMacrosByChatId(this.chat.id).then(macros => {

            if (!macros.length) {
                this.context?.getChat()?.sendMessage(Lang.get("macroNoMacroFound"), { parse_mode : "HTML" });
                return Promise.resolve();
            }

            let message = Lang.get("macroList");
            for (const macro of macros) {
                message += ` • <code>${macro.macro}</code>\n`;
            }

            this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });

        }).catch(err => {
            Log.save(err.mesage, err.stack);
            this.context?.getChat()?.sendMessage(Lang.get("macroNoMacroFound"), { parse_mode : "HTML" });
        });
    }

    /**
     * Removes a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private async mremove(command: CommandContext): Promise<void> {

        if (!await this.context?.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        const params = command.getParams();
        if (!Array.isArray(params) || params.length < 1) {
            return Promise.resolve();
        }

        const content = params.shift()?.trim();
        if (!content?.length) {
            return Promise.resolve();
        }

        const macro = await getMacroByChatIdAndMacro(this.chat.id, content);
        if (!macro) {
            return Promise.resolve();
        }

        await removeMacro(macro.id).then(async () => {
            await this.mlist(command);

        }).catch(err => {
            Log.save(err.mesage, err.stack);
            this.context?.getChat()?.sendMessage(Lang.get("macroRemoveError"), { parse_mode : "HTML" });
        });
    }
}
