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

import ChatHelper from "helpers/Chat";
import ChatRules from "models/ChatRules";
import Command from "./Command";
import Context from "contexts/Context";
import CommandContext from "contexts/Command";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { ChatRules as ChatRulesType } from "models/type/ChatRules";

export default class Rules extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
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
     */
    public constructor() {
        super();
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context?.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        Lang.set(chat?.language ?? "en");

        this.command = command;
        this.chat = chat ?? { id: null };

        this.context?.getMessage()?.delete();
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
            return this.context?.getChat()?.sendMessage(Lang.get("rulesNotFound"));
        }

        const chatRules = new ChatRules();
        chatRules
            .select()
            .where("chat_id").equal(this.chat.id)
            .and("rules").notEqual("");

        const result = await chatRules.execute<ChatRulesType[]>();

        if (!result.length) {
            return this.context?.getChat()?.sendMessage(Lang.get("rulesNotFound"));
        }

        return this.context?.getChat()?.sendMessage(result[0].rules!, { parse_mode : "HTML" });
    }

    /**
     * Adds the group rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     */
    private async addrules(): Promise<void> {

        const text = this.context?.getMessage()?.getText().replace(`/${this.command!.getCommand()}`, "").trim() ?? "";
        if (!text.length || text.length < 2) {
            return Promise.resolve();
        }

        const rules = text.replace(/^\\n/, "").replace(/\\n$/, "").trim();

        try {

            await this.insertOrUpdateRules(rules);

            let message = Lang.get("rulesUpdated");
            message += "\n\n" + rules;

            this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });

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

        const result = await chatRules.execute<ChatRulesType[]>();
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
