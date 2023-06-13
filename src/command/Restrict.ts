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
import ChatConfigs from "../model/ChatConfigs.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";

export default class Restrict extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
     public constructor(context: Context) {
        super(context);
        this.setCommands(["restrict"]);
        this.setParams(["index", "on", "off"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param payload
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        const params = command.getParams();

        let action = "index";
        if (params && params.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        this.context.message.delete();

        const method = action as keyof typeof Restrict.prototype;
        await this[method](true as never);
    }

    /**
     * Returns the restriction status.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    private async index(): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
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

        this.context.chat.sendMessage(restrictMessage);
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

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        const result = await this.update(chat.id, 1);
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

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        const result = await this.update(chat.id, 0);
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
