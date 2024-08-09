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
import ChatRules from "../model/ChatRules.js";
import Context from "../library/telegram/context/Context.js";
import CommandContext from "../library/telegram/context/Command.js";
import { BotCommand } from "../library/telegram/type/BotCommand.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";
import Log from "../helper/Log.js";

export default class Rules extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
        { command: "rules", description: "Shows the group rules." },
        { command: "addrules", description: "Adds the group rules." },
        { command: "delrules", description: "Deletes the group rules." }
    ];

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     */
    private chat: Record<string, any> | undefined;

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @var {CommandContext}
     */
    private command: CommandContext | undefined;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     *
     * @returns
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        Lang.set(chat?.language || "us");

        this.command = command;
        this.chat = chat || { id: null };

        this.context.message.delete();
        switch (this.command.getCommand()) {

            case "rules":
                return this.rules();

            case "addrules":
                return this.addrules();

            case "delrules":
                return this.delrules();
        }

        return Promise.resolve();
    }

    /**
     * Shows the group rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     */
    private async rules(): Promise<void> {

        if (!this.chat) {
            return this.context.chat.sendMessage(Lang.get("rulesNotFound"));
        }

        const chatRules = new ChatRules();
        chatRules
            .select()
            .where("chat_id").equal(this.chat.id);

        const result = await chatRules.execute();

        if (!result.length) {
            return this.context.chat.sendMessage(Lang.get("rulesNotFound"));
        }

        return this.context.chat.sendMessage(result[0].rules, { parseMode: "HTML" });
    }

    /**
     * Adds the group rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     */
    private async addrules(): Promise<void> {

        const text = this.context.message.getText().replace(`/${this.command!.getCommand()}`, "").trim();
        if (!text.length || text.length < 2) {
            return;
        }

        const rules = text.replace(/^\\n/, "").replace(/\\n$/, "").trim();

        try {

            await this.insertOrUpdateRules(rules);

            let message = Lang.get("rulesUpdated");
            message += "\n\n" + rules;

            this.context.chat.sendMessage(message, { parseMode: "HTML" });

        } catch (error: any) {
            Log.save(error.message);
        }
    }

    /**
     * Deletes the rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     */
    private async delrules(): Promise<void> {

        const chatRules = new ChatRules();
        chatRules
            .delete()
            .where("chat_id").equal(this.chat!.id);

        await chatRules.execute();
    }

    /**
     * Inserts or updates the rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @param rules
     */
    private async insertOrUpdateRules(rules: string): Promise<void> {

        const chatRules = new ChatRules();

        chatRules
            .select()
            .where("chat_id").equal(this.chat!.id);

        const result = await chatRules.execute();
        if (result.length) {

            chatRules
                .update()
                .set("rules", rules)
                .where("chat_id").equal(this.chat!.id);

            return await chatRules.execute();
        }

        chatRules
            .insert()
            .set("chat_id", this.chat!.id)
            .set("rules", rules);

        return await chatRules.execute();
    }
}
