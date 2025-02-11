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
import { BotCommand } from "../library/telegram/type/BotCommand.js";
import ChatConfigs from "../model/ChatConfigs.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";

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
        if (!await this.context.user.isAdmin()) {
            return;
        }

        const params = command.getParams();

        let action = "index";
        if (params?.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        this.context.message.delete();

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

        const chat = await ChatHelper.getByTelegramId(this.context!.chat.getId());
        if (!chat?.id) {
            return;
        }

        const chatConfig = new ChatConfigs();
        chatConfig
            .select()
            .where("chat_id").equal(chat.id);

        const config = await chatConfig.execute();
        if (!config.length) {
            return;
        }

        Lang.set(chat.language || "us");
        const restrictStatus = Lang.get(parseInt(config[0].restrict_new_users) === 1 ? "textEnabled" : "textDisabled");
        const restrictMessage = Lang.get("restrictStatus").replace("{status}", restrictStatus);

        this.context!.chat.sendMessage(restrictMessage);
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

        const chat = await ChatHelper.getByTelegramId(this.context!.chat.getId());
        if (!chat?.id) {
            return;
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

        const chat = await ChatHelper.getByTelegramId(this.context!.chat.getId());
        if (!chat?.id) {
            return;
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
