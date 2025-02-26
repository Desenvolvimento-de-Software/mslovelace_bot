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

import ChatConfigs from "model/ChatConfigs";
import ChatHelper from "helper/Chat";
import ChatMessages from "model/ChatMessages";
import Command from "./Command";
import CommandContext from "context/Command";
import Context from "context/Context";
import Lang from "helper/Lang";
import { BotCommand } from "library/telegram/type/BotCommand";
import { ChatMessage as ChatMessageType } from "model/type/ChatMessage";
import { ResultSetHeader } from "mysql2";

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

        return Promise.resolve();
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

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        const chatMessages = new ChatMessages();
        chatMessages
            .select()
            .where("chat_id").equal(chat.id);

        const result = await chatMessages.execute<ChatMessageType[]>();
        if (!result.length) {
            this.context?.getChat()?.sendMessage(Lang.get("greetingsMessageNotSet"), { parse_mode : "HTML" });
            return;
        }

        const greetingsDemo = Lang.get("greetingsMessageDemo")
            .replace("{greetings}", result[0].greetings)
            .replace("{userid}", this.context?.getUser()?.getId())
            .replace(
                "{username}", this.context?.getUser()?.getFirstName() ?? this.context?.getUser()?.getUsername()
            );

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

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language);
        const result = await this.updateGreetingsStatus(chat.id, 1);

        const greetingsStatus = Lang.get("textEnabled");
        const greetingsMessage = Lang.get("greetingsStatus").replace("{status}", greetingsStatus);

        if (result.affectedRows > 0) {
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

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language);
        const result = await this.updateGreetingsStatus(chat.id, 0);

        const greetingsStatus = Lang.get("textDisabled");
        const greetingsMessage = Lang.get("greetingsStatus").replace("{status}", greetingsStatus);

        if (result.affectedRows > 0) {
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

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        const chatMessage = new ChatMessages();
        chatMessage
            .update()
            .set("greetings", params.join(" "))
            .where("chat_id").equal(chat.id);

        const result = await chatMessage.execute<ResultSetHeader>();
        if (result.affectedRows > 0) {
            this.index();
        }
    }

    /**
     * Updates the greetings status.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {number} chatId
     * @param {number} status
     */
    private async updateGreetingsStatus(chatId: number, status: number): Promise<any> {

        const update = new ChatConfigs();
        update
            .update()
            .set("greetings", status)
            .where("chat_id").equal(chatId);

        return update.execute();
    }
}
