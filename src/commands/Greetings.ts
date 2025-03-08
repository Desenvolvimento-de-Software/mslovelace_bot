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
import CommandContext from "contexts/Command";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { getChatByTelegramId, getChatMessagesByChatId } from "services/Chats";
import { PrismaClient } from "@prisma/client";
import Log from "helpers/Log";

export default class GreetingsCommand extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "greetings", description: "Manages the greetings message with [on | off | set]." }
    ];

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    private command?: CommandContext;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor() {
        super();
        this.setParams(["on", "off", "set"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context?.getUser()?.isAdmin()) {
            return;
        }

        this.context?.getMessage()?.delete();
        this.command = command;
        const params = command.getParams();

        let action = "index";
        if (params?.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        const method = action as keyof GreetingsCommand;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    private async index(): Promise<void> {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        const chatMessages = await getChatMessagesByChatId(chat.id);
        if (chatMessages) {
            this.context?.getChat()?.sendMessage(Lang.get("greetingsMessageNotSet"), { parse_mode : "HTML" });
            return;
        }

        const username = (
            this.context?.getUser()?.getFirstName() ??
            this.context?.getUser()?.getUsername() ??
            this.context?.getUser()?.getId().toString()
        );

        const greetingsDemo = Lang.get("greetingsMessageDemo")
            .replace("{greetings}", chatMessages!.greetings ?? "")
            .replace("{userid}", this.context!.getUser()!.getId().toString())
            .replace("{username}", username!);

        this.context?.getChat()?.sendMessage(greetingsDemo, { parse_mode : "HTML" });
    }

    /**
     * Activates the greetings message.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    private async on(): Promise<void> {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language);
        const result = await this.updateGreetingsStatus(chat.id, true);
        const greetingsStatus = Lang.get("textEnabled");
        const greetingsMessage = Lang.get("greetingsStatus").replace("{status}", greetingsStatus);

        if (result) {
            this.context?.getChat()?.sendMessage(greetingsMessage);
        }
    }

    /**
     * Deactivates the greetings message.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    private async off(): Promise<void> {

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language);
        const result = await this.updateGreetingsStatus(chat.id, false);

        const greetingsStatus = Lang.get("textDisabled");
        const greetingsMessage = Lang.get("greetingsStatus").replace("{status}", greetingsStatus);

        if (result) {
            this.context?.getChat()?.sendMessage(greetingsMessage);
        }
    }

    /**
     * Sets the greetings message.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    private async set(): Promise<void> {

        if (!this.command) {
            return;
        }

        const params = this.command.getParams();
        if (!params?.length) {
            return;
        }

        params.shift();

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        const prisma = new PrismaClient();
        await prisma.chat_messages.upsert({
            where: { chat_id: chat.id },
            update: { greetings: params.join(" ") },
            create: { chat_id: chat.id, greetings: params.join(" ") }

        }).then(() => {
            this.index();

        }).catch(async (err: Error) => {
            Log.save(err.message, err.stack);
        }).finally(() => {
            prisma.$disconnect();
        });
    }

    /**
     * Updates the greetings status.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {number} chatId
     * @param {boolean} status
     *
     * @return {boolean}
     */
    private async updateGreetingsStatus(chatId: number, status: boolean): Promise<boolean> {

        const prisma = new PrismaClient();
        return await prisma.chat_configs.update({
            where: { chat_id: chatId },
            data: { greetings: status }

        }).then(() => {
            this.index();
            return true;

        }).catch(async (err: Error) => {
            Log.save(err.message, err.stack);
            return false;

        }).finally(() => {
            prisma.$disconnect();
        });
    }
}
