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

import Callback from "./Callback";
import CallbackQuery from "contexts/CallbackQueryy";
import ChatHelper from "helpers/Chat";
import Lang from "helpers/Lang";
import UserHelper from "helpers/User";
import Warnings from "models/Warnings";

export default class Warning extends Callback {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param context
     */
     public constructor(context: CallbackQuery) {
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

        const userId = this.context?.getUser()?.getId();
        const chatId = this.context?.getChat()?.getId();

        if (!userId || !chatId) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(userId);
        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!user || !chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        if (!await this.context.getUser()?.isAdmin()) {
            this.context.getCallbackQuery()?.answer(Lang.get("adminOnlyAction"));

            const message = Lang.get("adminOnlyActionMessage")
                .replace("{userid}", this.context.getUser()?.getId())
                .replace("{username}", this.context.getUser()?.getFirstName() || this.context.getUser()?.getUsername());

            this.context.getChat()?.sendMessage(message, { parse_mode: "HTML" });
            return Promise.resolve();
        }

        const callbackQuery = this.context.getCallbackQuery();
        if (!callbackQuery) {
            return Promise.resolve();
        }

        const callbackData = callbackQuery.getData();
        if (!callbackData) {
            return Promise.resolve();
        }

        const data = callbackData.d as string;
        const [callbackUserId, callbackChatId, callbackWarningId] = data.split(",");

        this.context.getCallbackQuery()?.answer("OK");
        this.context.getMessage()?.delete();

        const contextUser = await UserHelper.getByTelegramId(userId);
        if (!contextUser) {
            return Promise.resolve();
        }

        await this.remove(parseInt(callbackUserId), parseInt(callbackChatId), parseInt(callbackWarningId));

        let message = Lang.get(typeof callbackWarningId === "undefined" ? "warningAdminRemovedAll" : "warningAdminRemovedLast")
            .replace("{userid}", contextUser.user_id)
            .replace("{username}", contextUser.first_name || user.username)
            .replace("{adminId}", this.context.getUser()?.getId())
            .replace("{adminUsername}", this.context.getUser()?.getFirstName() ?? this.context.getUser()?.getUsername());

        this.context.getChat()?.sendMessage(message, { parse_mode: "HTML" });
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
