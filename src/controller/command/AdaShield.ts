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

import App from "../../App.js";
import Command from "../Command.js";
import Chats from "../../model/Chats.js";
import ChatHelper from "../../helper/Chat.js";
import Lang from "../../helper/Lang.js";
import SendMessage from "../../library/telegram/resource/SendMessage.js";

export default class AdaShield extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param app App instance.
     */
    public constructor(app: App) {
        super(app);
    }

    /**
     * Shows the AdaShield status.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param payload Telegram API payload.
     */
    public async index(payload: Record<string, any>): Promise<void> {

        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language || "us");
        const adaShieldStatus = Lang.get(parseInt(chat.adashield) === 1 ? "textEnabled" : "textDisabled");
        const adaShieldMessage = Lang.get("adaShieldStatus").replace("{status}", adaShieldStatus);

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(chat.chat_id)
            .setText(adaShieldMessage)
            .setParseMode("HTML")
            .post();
    }

    /**
     * Enables the AdaShield.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param payload
     */
    public async on(payload: Record<string, any>): Promise<void> {

        try {

            const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
            await this.change(chat, 1);
            this.index(payload);

        } catch (err: any) {
            this.app.log(err.toString());
        }
    }

    /**
     * Enables the AdaShield.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param payload
     */
    public async off(payload: Record<string, any>): Promise<void> {

        try {

            const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
            await this.change(chat, 0);
            this.index(payload);

        } catch (err: any) {
            this.app.log(err.toString());
        }
    }

    /**
     * Changes the AdaShield status.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param chat Chat object.
     * @param status New AdaShield status.
     */
    public async change(chat: Record<string, any>, status: number) {

        try {

            const update = new Chats();
            update
                .update()
                .set("adashield", status)
                .where("id").equal(chat.id);

            await update.execute();

        } catch (err: any) {
            this.app.log(err.toString());
        }
    }
}
