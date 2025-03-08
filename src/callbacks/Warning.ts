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

import { PrismaClient } from "@prisma/client";
import Callback from "./Callback";
import CallbackQuery from "contexts/CallbackQuery";
import Lang from "helpers/Lang";
import { getUserByTelegramId } from "services/Users";
import { getUserAndChatByTelegramId } from "services/UsersAndChats";
import Log from "helpers/Log";

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

        const userAndChat = await getUserAndChatByTelegramId(userId, chatId);
        if (!userAndChat) {
            return Promise.resolve();
        }

        Lang.set(userAndChat.chats?.language || "en");

        if (!await this.context.getUser()?.isAdmin()) {

            this.context.getCallbackQuery()?.answer(Lang.get("adminOnlyAction"));

            const username = (
                this.context.getUser()?.getFirstName() ??
                this.context.getUser()?.getUsername() ??
                this.context.getUser()?.getId().toString()
            );

            const message = Lang.get("adminOnlyActionMessage")
                .replace("{userid}", this.context.getUser()!.getId().toString())
                .replace("{username}", username!);

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

        const contextUser = await getUserByTelegramId(parseInt(callbackUserId));
        if (!contextUser) {
            return Promise.resolve();
        }

        await this.remove(parseInt(callbackUserId), parseInt(callbackChatId), parseInt(callbackWarningId));

        const admin = (
            this.context.getUser()?.getFirstName() ??
            this.context.getUser()?.getUsername() ??
            this.context.getUser()?.getId().toString()
        );

        let message = Lang.get(typeof callbackWarningId === "undefined" ? "warningAdminRemovedAll" : "warningAdminRemovedLast")
            .replace("{userid}", contextUser.user_id.toString())
            .replace("{username}", contextUser.first_name ?? contextUser.username ?? contextUser.user_id.toString())
            .replace("{adminId}", this.context.getUser()!.getId().toString())
            .replace("{adminUsername}", admin!);

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
    private async remove(userId: number, chatId: number, warningId: number): Promise<boolean> {

        const userAndChat = await getUserAndChatByTelegramId(userId, chatId);
        if (!userAndChat) {
            return Promise.resolve(false);
        }

        const where: { user_id: number; chat_id: number; id?: number } = {
            user_id: userId,
            chat_id: chatId
        };

        if (warningId > 0) {
            where["id"] = warningId;
        }

        const prisma = new PrismaClient();
        return await prisma.warnings.updateMany({
            where: where,
            data: { status: false }

        }).then(() => {
            return true;

        }).catch (err => {
            Log.save(err.message, err.stack);
            return false;

        }).finally(async () => {
            await prisma.$disconnect();
        });
    }
}
