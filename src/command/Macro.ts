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

import Command from "./Command.js";
import Context from "../library/telegram/context/Context.js";
import CommandContext from "../library/telegram/context/Command.js";
import ChatHelper from "../helper/Chat.js";
import Chats from "../model/Chats.js";
import Macros from "../model/Macros.js";
import Lang from "../helper/Lang.js";

export default class Macro extends Command {

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
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["macro", "madd", "mlist", "mremove"]);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    public async run(command: CommandContext): Promise<void> {

        this.context.message.delete();

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat) {
            return;
        }

        Lang.set(chat.language || "us");

        this.chat = chat;

        let action = "index";
        if (Macro.prototype.hasOwnProperty(command.getCommand())) {
            action = command.getCommand();
        }

        const method = action as keyof typeof Macro.prototype;
        await this[method](command as never);
    }

    /**
     * Shows a macro.
     *
     * @author Marcos Leandro
     * @since  2023-11-18
     *
     * @param command
     */
    private index(command: CommandContext): void {

        const params = command.getParams();
        if (!Array.isArray(params) || params.length < 1) {
            return;
        }

        const macro = params.shift()?.trim();
        if (!macro || !macro.length) {
            return;
        }

        const macros = new Macros();
        macros
            .select()
            .where("chat_id").equal(this.chat.id)
            .and("macro").equal(macro);

        macros.execute().then((result: Record<string, any>) => {

            if (!result.length) {
                return;
            }

            const content = result[0].content;
            const replyToMessage = this.context.message.getReplyToMessage();

            if (replyToMessage) {
                replyToMessage.reply(content, { parseMode : "HTML" });
                return;
            }

            this.context.chat.sendMessage(content, { parseMode : "HTML" });
        });
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

        if (!await this.context.user.isAdmin()) {
            return;
        }

        let params = command.getParams();
        if (!Array.isArray(params) || params.length < 2) {
            this.context.chat.sendMessage(Lang.get("macroMalformedCommandError"), { parseMode : "HTML" });
            return;
        }

        const macro = params.shift()?.trim();
        const content = params.join(" ").trim();

        if (!macro || !macro.length || !content.length) {
            this.context.chat.sendMessage(Lang.get("macroMalformedCommandError"), { parseMode : "HTML" });
            return;
        }

        const macros = new Macros();
        macros
            .select()
            .where("chat_id").equal(this.chat.id)
            .and("macro").equal(macro.toLowerCase());

        const result = await macros.execute();

        if (result.length) {
            const alreadyExistLang = Lang.get("macroAlreadyExists").replace("{macro}", macro);
            this.context.chat.sendMessage(alreadyExistLang, { parseMode : "HTML" });
            return;
        }

        macros
            .insert()
            .set("chat_id", this.chat.id)
            .set("macro", macro.toLowerCase())
            .set("content", content);

        if (await macros.execute()) {
            this.mlist(command);
            return;
        }

        this.context.chat.sendMessage(Lang.get("macroAddError"), { parseMode : "HTML" });
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

        const macros = new Macros();
        macros
            .select()
            .where("chat_id").equal(this.chat.id)
            .orderBy("macro", "asc");

        const result = await macros.execute();
        if (!result.length) {
            this.context.chat.sendMessage(Lang.get("macroNoMacroFound"), { parseMode : "HTML" });
            return;
        }

        let message = Lang.get("macroList");
        for (const row of result) {
            message += ` • ${row.macro}\n`;
        }

        this.context.chat.sendMessage(message, { parseMode : "HTML" });
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

        if (!await this.context.user.isAdmin()) {
            return;
        }

        const params = command.getParams();
        if (!Array.isArray(params) || params.length < 1) {
            return;
        }

        const macro = params.shift()?.trim();
        if (!macro || !macro.length) {
            return;
        }

        const macros = new Macros();
        macros
            .select()
            .where("chat_id").equal(this.chat.id)
            .and("macro").equal(macro);

        const result = await macros.execute();

        if (result.length) {

            macros
                .delete()
                .where("chat_id").equal(this.chat.id)
                .and("macro").equal(macro.toLowerCase());

            macros.execute();
        }

        this.mlist(command);
    }
}
