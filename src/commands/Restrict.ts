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

import ChatConfigs from "models/ChatConfigs";
import ChatHelper from "helpers/Chat";
import Command from "./Command";
import CommandContext from "contexts/Command";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { ChatConfigs as ChatConfigsType } from "models/type/ChatConfigs";

export default class Restrict extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "restrict", description: "Shows the new users restriction status. Manages new users from sending messages with [on | off]." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
     public constructor() {
        super();
        this.setParams(["index", "on", "off"]);
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
        if (!await this.context.getUser()?.isAdmin()) {
            return Promise.resolve();
        }

        const params = command.getParams();

        let action = "index";
        if (params?.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        this.context.getMessage()?.delete();

        const method = action as keyof Restrict;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }

        return Promise.resolve();
    }

    /**
     * Returns the restriction status.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
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

        const chatConfig = new ChatConfigs();
        chatConfig
            .select()
            .where("chat_id").equal(chat.id);

        const config = await chatConfig.execute<ChatConfigsType[]>();
        if (!config.length) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");
        const restrictStatus = Lang.get(config[0].restrict_new_users === 1 ? "textEnabled" : "textDisabled");
        const restrictMessage = Lang.get("restrictStatus").replace("{status}", restrictStatus);

        this.context?.getChat()?.sendMessage(restrictMessage);
    }

    /**
     * Activates the new users restriction.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @return {Promise<void>}
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

        await this.update(chat.id, 1);
        this.index();
    }

    /**
     * Deactivates the new users restriction.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @return {Promise<void>}
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

        await this.update(chat.id, 0);
        this.index();
    }

    /**
     * Updates the restriction status.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {number} chatId
     * @param {number} status
     *
     * @return {Promise<any>}
     */
    private async update(chatId: number, status: number): Promise<any> {

        const chatConfig = new ChatConfigs();
        chatConfig
            .update()
            .set("restrict_new_users", status)
            .where("chat_id").equal(chatId);

        return chatConfig.execute();
    }
}
