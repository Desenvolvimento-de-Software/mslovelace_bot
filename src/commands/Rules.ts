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
import { getChatByTelegramId, getChatRulesByChatId } from "services/Chats";
import { PrismaClient } from "@prisma/client";

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

        const chat = await getChatByTelegramId(chatId);
        Lang.set(chat?.language ?? "en");

        this.command = command;
        this.chat = chat ?? { id: null };

        this.context?.getMessage()?.delete();
        switch (this.command.getCommand()) {

            case "rules":
                this.rules();
                break;

            case "addrules":
                this.addrules();
                break;

            case "delrules":
                this.delrules();
                break;
        }
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

        const chatRules = await getChatRulesByChatId(this.chat.id);
        if (!chatRules?.rules) {
            return this.context?.getChat()?.sendMessage(Lang.get("rulesNotFound"));
        }

        await this.context?.getChat()?.sendMessage(chatRules.rules, { parse_mode : "HTML" }).then(() => {
            return true;
        }).catch (error => {
            Log.save(error.message, error.stack);
            return false;
        });
    }

    /**
     * Adds the group rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @return true on success, false on failure.
     */
    private async addrules(): Promise<boolean> {

        const text = this.context?.getMessage()?.getText().replace(`/${this.command!.getCommand()}`, "").trim() ?? "";
        if (!text.length || text.length < 2) {
            return Promise.resolve(false);
        }

        const rules = text.replace(/^\\n/, "").replace(/\\n$/, "").trim();

        try {

            await this.insertOrUpdateRules(rules);

            let message = Lang.get("rulesUpdated");
            message += "\n\n" + rules;

            this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });
            return true;

        } catch (error: any) {
            Log.save(error.message, error.stack);
            return false;
        }
    }

    /**
     * Deletes the rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @return true on success, false on failure.
     */
    private async delrules(): Promise<boolean> {

        const prisma = new PrismaClient();

        return await prisma.chat_rules.delete({
            where: { chat_id: this.chat!.id }

        }).then(() => {
            return true;

        }).catch(err => {
            Log.save(err.message, err.stack);
            return false;

        }).finally(() => {
            prisma.$disconnect();
        });
    }

    /**
     * Inserts or updates the rules.
     *
     * @author Marcos Leandro
     * @since  2024-07-30
     *
     * @param rules
     *
     * @return true on success, false on failure.
     */
    private async insertOrUpdateRules(rules: string): Promise<boolean> {

        const prisma = new PrismaClient();
        return prisma.chat_rules.upsert({
            where: { chat_id: this.chat!.id },
            update: { rules: rules },
            create: { chat_id: this.chat!.id, rules: rules }

        }).then(() => {
            return true;

        }).catch(err => {
            Log.save(err.message, err.stack);
            return false;

        }).finally(() => {
            prisma.$disconnect();
        });
    }
}
