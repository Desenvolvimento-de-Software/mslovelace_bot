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

import Callback from "./Callback.js";
import Warnings from "../model/Warnings.js";
import Context from "../library/telegram/context/Context.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import Lang from "../helper/Lang.js";
import { parse } from "dotenv";

export default class Warning extends Callback {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param context
     */
     public constructor(context: Context) {
        super(context);
        this.setCallbacks(["warning"]);
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     */
    public async run(): Promise<void> {

        const user = await UserHelper.getByTelegramId(this.context.user.getId());
        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        if (!user || !chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "us");

        if (!await this.context.user.isAdmin()) {
            this.context.callbackQuery?.answer(Lang.get("adminOnlyAction"));

            const message = Lang.get("adminOnlyActionMessage")
                .replace("{userid}", this.context.user.getId())
                .replace("{username}", this.context.user.getFirstName() || this.context.user.getUsername());

            this.context.chat.sendMessage(message, { parseMode: "HTML" });
            return Promise.resolve();
        }

        const [userId, chatId, warningId] = this.context.callbackQuery?.callbackData?.d?.split(",");
        this.context.callbackQuery?.answer("OK");
        this.context.message.delete();

        const contextUser = await UserHelper.getByTelegramId(userId);
        await this.remove(userId, chatId, warningId);

        let message = Lang.get(typeof warningId === "undefined" ? "warningAdminRemovedAll" : "warningAdminRemovedLast")
            .replace("{userid}", contextUser.user_id)
            .replace("{username}", contextUser.first_name || user.username)
            .replace("{adminId}", this.context.user.getId())
            .replace("{adminUsername}", this.context.user.getFirstName() || this.context.user.getUsername());

        this.context.chat.sendMessage(message, { parseMode: "HTML" });
    }

    /**
     * Removes one or all the warnings.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param userId
     * @param chatId
     * @param warningId
     */
    private async remove(userId: number, chatId: number, warningId: number|undefined = undefined): Promise<void> {

        const user = await UserHelper.getByTelegramId(userId);
        const chat = await ChatHelper.getByTelegramId(chatId);

        const warnings = new Warnings();
        const update =  warnings.update();

        update
            .set("status", 0)
            .where("user_id").equal(user!.id)
            .and("chat_id").equal(chat!.id);

        if (typeof warningId !== "undefined") {
            update.and("id").equal(warningId);
        }

        await warnings.execute();
    }
}
