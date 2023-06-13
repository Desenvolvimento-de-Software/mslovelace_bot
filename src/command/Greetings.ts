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
import Context from "../library/telegram/context/Context";
import CommandContext from "../library/telegram/context/Command";
import ChatHelper from "../helper/Chat";
import ChatConfigs from "../model/ChatConfigs";
import ChatMessages from "../model/ChatMessages";
import Lang from "../helper/Lang";

export default class GreetingsCommand extends Command {

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
    public constructor(context: Context) {
        super(context);
        this.setCommands(["greetings", "greeting"]);
        this.setParams(["on", "off", "set"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {CommandContext} command
     */
    public async run(command: CommandContext): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        this.context.message.delete();
        this.command = command;
        const params = command.getParams();

        let action = "index";
        if (params && params.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        const method = action as keyof typeof GreetingsCommand.prototype;
        await this[method](true as never);
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    private async index(): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language || "us");

        const chatMessages = new ChatMessages();
        chatMessages
            .select()
            .where("chat_id").equal(chat.id);

        const result = await chatMessages.execute();

        if (!result.length) {
            this.context.chat.sendMessage(Lang.get("greetingsMessageNotSet"), { parseMode: "HTML" });
            return;
        }

        let greetingsDemo = Lang.get("greetingsMessageDemo");
        greetingsDemo = greetingsDemo.replace("{greetings}", result[0].greetings);
        greetingsDemo = greetingsDemo.replace("{userid}", this.context.user.getId());
        greetingsDemo = greetingsDemo.replace(
            "{username}",
            this.context.user.getFirstName() || this.context.user.getUsername()
        );

        this.context.chat.sendMessage(greetingsDemo, { parseMode: "HTML" });
    }

    /**
     * Activates the greetings message.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    private async on(): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language);
        const result = await this.updateGreetingsStatus(chat.id, 1);

        if (result.affectedRows > 0) {
            this.context.chat.sendMessage(Lang.get("commandGreetingsActivated"));
        }
    }

    /**
     * Deactivates the greetings message.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    private async off(): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language);
        const result = await this.updateGreetingsStatus(chat.id, 0);

        if (result.affectedRows > 0) {
            this.context.chat.sendMessage(Lang.get("commandGreetingsDeactivated"));
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
        if (!params || !params.length) {
            return;
        }

        params.shift();

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        const chatMessage = new ChatMessages();
        chatMessage
            .update()
            .set("greetings", params.join(" "))
            .where("chat_id").equal(chat.id);

        const result = await chatMessage.execute();

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
