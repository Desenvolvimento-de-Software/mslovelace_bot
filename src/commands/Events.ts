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
import Log from "helpers/Log";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { ChatWithConfigs } from "types/ChatWithConfigs";
import { getChatByTelegramId } from "services/Chats";
import { PrismaClient } from "@prisma/client";

export default class Events extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "events", description: "Manages the event messageswith [on | off]." }
    ];

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    private command?: CommandContext;

    /**
     * Chat object.
     *
     * @author Marcos Leeandro
     * @since 2025-03-08
     */
    private chat?: ChatWithConfigs;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     */
    public constructor() {
        super();
        this.setParams(["on", "off"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!await this.context.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        this.context.getMessage()?.delete();
        this.command = command;
        const params = command.getParams();

        this.chat = await getChatByTelegramId(context?.getChat()?.getId() ?? 0) ?? undefined;
        if (!this.chat) {
            return Promise.resolve();
        }

        Lang.set(this.chat.language ?? "en");

        let action = "index";
        if (params?.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        switch (action) {
            case "on":
                return await this.on();

            case "off":
                return await this.off();

            default:
                return await this.index();
        }
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     */
    public async index(): Promise<void> {
        const idx = this.chat?.chat_configs?.remove_event_messages ? "textDisabled" : "textEnabled";
        const eventMessagesStatus = Lang.get(idx);
        const eventMessagesMessage = Lang.get("eventMessagesStatus").replace("{status}", eventMessagesStatus);
        this.context?.getChat()?.sendMessage(eventMessagesMessage);
    }

    /**
     * Activates the event messages.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     */
    private async on(): Promise<void> {
        this.update(this.chat!.id, false);
        this.index();
    }

    /**
     * Deactivates the event messages.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     */
    private async off(): Promise<void> {
        this.update(this.chat!.id, true);
        this.index();
    }

    /**
     * Updates the event messages in the database.
     *
     * @author Marcos Leandro
     * @since  2024-09-27
     *
     * @param {number} chatId
     * @param {boolean} status
     */
    private async update(chatId: number, status: boolean): Promise<boolean> {

        const data: { captcha: boolean; greetings?: boolean } = { captcha: status };
        if (status) {
            data.greetings = true;
        }

        const prisma = new PrismaClient();
        return await prisma.chat_configs.update({
            where: { chat_id: chatId },
            data: { remove_event_messages: status }

        }).then(() => {
            return true;

        }).catch(async (err: Error) => {
            Log.save(err.message, err.stack);
            return false;

        }).finally(() => {
            prisma.$disconnect();
        });
    }
}
