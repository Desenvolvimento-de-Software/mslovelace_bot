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

import Bans from "model/Bans";
import ChatHelper from "helper/Chat";
import Context from "context/Context";
import Federation from "./Federation";
import FederationHelper from "helper/Federation";
import Lang from "helper/Lang";
import Log from "helper/Log";
import Message from "context/Message";
import User from "context/User";
import UserHelper from "helper/User";
import { BotCommand } from "library/telegram/type/BotCommand";

export default class Ban extends Federation {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     */
    public readonly commands: BotCommand[] = [
        { command: "fban", description: "Bans an user in the federation." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    public constructor() {
        super();
    }

    /**
     * Bans an user from the federation.
     *
     * @author Marcos Leandro
     * @since  2023-08-09
     *
     * @return Promise<void>
     */
    private async ban(): Promise<void> {

        if (!this.federation) {
            return Promise.resolve();
        }

        const isUserAdmin = await FederationHelper.isUserAdmin(Number(this.user!.id), this.federation);
        if (!isUserAdmin) {
            this.context?.getMessage()?.reply(Lang.get("fedBanOnlyAdminError"));
            return Promise.resolve();
        }

        this.context?.getMessage()?.delete();
        let params = this.command!.getParams() || [];

        const replyToMessage = this.context?.getMessage()?.getReplyToMessage();
        if (replyToMessage) {
            this.banByReply(replyToMessage, params.join(" ").trim());
            return Promise.resolve();
        }

        const mentions = await this.context?.getMessage()?.getMentions();
        if (mentions?.length) {
            params = params.filter((param) => !param.startsWith("@"));
            mentions.forEach((mention) => {
                this.banByMention(mention, params.join(" ").trim());
            });
        }

        const userId = parseInt(params[0]);
        if (userId === Number(params[0])) {
            params.shift();
            this.banByUserId(userId, params.join(" ").trim());
        }
    }

    /**
     * Bans an user by message reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @return void
     */
    private async banByReply(replyToMessage: Message, reason: string): Promise<void> {

        const replyToMessageUser = replyToMessage.getUser();
        if (!replyToMessageUser) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(replyToMessageUser.getId());
        const federationChats = await FederationHelper.getChats(this.federation!);

        for (const chat of federationChats) {
            const context = this.getContext(user, chat);
            this.saveBan(context, reason);
            context?.getUser()?.ban();
        }

        const message = Lang.get("fedBannedMessage")
            .replace("{userId}", user.user_id)
            .replace("{username}", user.first_name || user.username || user.user_id)
            .replace("{reason}", reason.length ? reason : "Unknown");

        this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });
    }

    /**
     * Bans an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @return void
     */
    private async banByMention(mention: User, reason: string): Promise<void> {

        const user = await UserHelper.getByTelegramId(mention.getId());
        const federationChats = await FederationHelper.getChats(this.federation!);

        for (const chat of federationChats) {
            const context = this.getContext(user, chat);
            this.saveBan(context, reason);
            context.getUser()?.ban();
        }

        const message = Lang.get("fedBannedMessage")
            .replace("{userId}", user.user_id)
            .replace("{username}", user.first_name || user.username || user.user_id)
            .replace("{reason}", reason.length ? reason : "Unknown");

        this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });
    }

    /**
     * Bans the user by Telegram ID.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param userId
     * @param reason
     *
     * @return {Promise<Record<string, any>|undefined>}
     */
    private async banByUserId(userId: number, reason: string): Promise<void> {

        const user = await UserHelper.getByTelegramId(userId);
        const federationChats = await FederationHelper.getChats(this.federation!);

        for (const chat of federationChats) {
            const context = this.getContext(user, chat);
            this.saveBan(context, reason);
            context.getUser()?.ban();
        }

        const message = Lang.get("fedBannedMessage")
            .replace("{userId}", user.user_id)
            .replace("{username}", user.first_name || user.username || user.user_id)
            .replace("{reason}", reason.length ? reason : "Unknown");

        this.context?.getChat()?.sendMessage(message, { parse_mode : "HTML" });
    }

    /**
     * Saves the ban.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param context
     * @param reason
     *
     * @return void
     */
    private async saveBan(context: Context, reason: string): Promise<void> {

        const userId = context.getUser()?.getId();
        const chatId = context.getChat()?.getId();

        if (!userId || !chatId) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(userId);
        const chat = await ChatHelper.getByTelegramId(chatId);

        if (!user || !chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        const ban = new Bans();
        const insert = ban.insert();
        insert
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("federation_id", chat.federation_id)
            .set("date", Math.floor(Date.now() / 1000));

        if (reason.length) {
            insert.set("reason", reason);
        }

        try {

            await ban.execute();

        } catch (err: any) {
            Log.error(err.toString());
        }
    }
}
