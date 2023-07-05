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

import Federation from "./Federation.js";
import Context from "../../library/telegram/context/Context.js";
import Message from "../../library/telegram/context/Message.js";
import User from "../../library/telegram/context/User.js";
import UserHelper from "../../helper/User.js";
import ChatHelper from "../../helper/Chat.js";
import FederationHelper from "../../helper/Federation.js";
import Lang from "../../helper/Lang.js";
import Log from "../../helper/Log.js";
import Bans from "../../model/Bans.js";

export default class Ban extends Federation {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["fban"]);
    }

    /**
     * Bans an user in the federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @return
     */
    private async ban(): Promise<void> {

        if (!await this.context.user.isAdmin()) {
            return;
        }

        const isUserAdmin = await FederationHelper.isUserAdmin(Number(this.user!.id), this.federation!);
        if (!isUserAdmin) {
            this.context.message.reply(Lang.get("fedBanOnlyAdminError"));
            return;
        }

        this.context.message.delete();
        let params = this.command!.getParams() || [];

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            this.banByReply(replyToMessage!, params.join(" ").trim());
            return;
        }

        const mentions = await this.context.message.getMentions();
        if (mentions.length) {
            params = params.filter((param) => param.indexOf("@") !== 0);
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

        const user = UserHelper.getByTelegramId(replyToMessage.getUser().getId());
        const federationChats = await FederationHelper.getChats(this.federation!);

        for (const chat of federationChats) {
            const context = this.getContext(user, chat);
            this.saveBan(context, reason);
            context.user.ban();
        }
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
            context.user.ban();
        }
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
            context.user.ban();
        }
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

        const user = await UserHelper.getByTelegramId(context.user.getId());
        const chat = await ChatHelper.getByTelegramId(context.chat.getId());

        if (!user || !chat) {
            return;
        }

        Lang.set(chat.language || "us");

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
            const message = Lang.get("fedBannedMessage")
                .replace("{userId}", context.user.getId())
                .replace("{username}", context.user.getFirstName() || context.user.getUsername())
                .replace("{reason}", reason.length ? reason : "Unknown");

            this.context.chat.sendMessage(message, { parseMode: "HTML" });

        } catch (err: any) {
            Log.error(err.toString());
        }
    }
}
