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
import ChatConfigs from "../model/ChatConfigs";
import UserHelper from "../helper/User";
import ChatHelper from "../helper/Chat";
import Lang from "../helper/Lang";
import Context from "../library/telegram/context/Context";
import CommandContext from "../library/telegram/context/Command";

export default class AdaShield extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["adashield"]);
        this.setParams(["index", "on", "off"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    public async run(command: CommandContext): Promise<void> {

        if (!UserHelper.isAdmin(this.context)) {
            return;
        }

        const params = command.getParams();

        let action = "index";
        if (params && params.length) {
            action = this.isRegisteredParam(params[0]) ? params[0] : "index";
        }

        this.context.message.delete();

        await this[action as keyof typeof this]();
        return Promise.resolve();
    }

    /**
     * Shows the AdaShield status.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param payload Telegram API payload.
     */
    public async index(): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language || "us");
        const adaShieldStatus = Lang.get(parseInt(chat.adashield) === 1 ? "textEnabled" : "textDisabled");
        const adaShieldMessage = Lang.get("adaShieldStatus").replace("{status}", adaShieldStatus);

        this.context.chat.sendMessage(adaShieldMessage);
    }

    /**
     * Activates the AdaShield.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     */
    private async on(): Promise<void> {
        await this.change(1);
        this.index();
    }

    /**
     * Deactivates the AdaShield.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     */
    private async off(): Promise<void> {
        await this.change(0);
        this.index();
    }

    /**
     * Changes the AdaShield status.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @param {Number} status New AdaShield status.
     */
    public async change(status: number) {

        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        const update = new ChatConfigs();
        update
            .update()
            .set("adashield", status)
            .where("chat_id").equal(chat.id);

        await update.execute();
    }
}
