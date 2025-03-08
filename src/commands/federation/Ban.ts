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

import Federation from "./Federation";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import Message from "contexts/Message";
import User from "contexts/User";
import { addFederationBan } from "services/Ban";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { isUserFederationAdmin } from "services/Federations";
import { getUserByTelegramId } from "services/Users";
import { users, chats } from "@prisma/client";
import SendMessage from "libraries/telegram/resources/SendMessage";

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

        const isUserAdmin = await isUserFederationAdmin(Number(this.user!.id), this.federation);
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

        const user = await getUserByTelegramId(replyToMessageUser.getId());
        if (!user) {
            return Promise.resolve();
        }

        for (const chat of this.federation!.chats) {
            const context = this.getContext(user, chat);
            context?.getUser()?.ban();
            this.saveBan(user, chat, reason);
            this.sendMessage(user, chat, reason);
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

        const user = await getUserByTelegramId(mention.getId());
        if (!user) {
            return Promise.resolve();
        }

        for (const chat of this.federation!.chats) {
            const context = this.getContext(user, chat);
            context.getUser()?.ban();
            this.saveBan(user, chat, reason);
            this.sendMessage(user, chat, reason);
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

        const user = await getUserByTelegramId(userId);
        if (!user) {
            return Promise.resolve();
        }

        for (const chat of this.federation!.chats) {
            const context = this.getContext(user, chat);
            context.getUser()?.ban();
            this.saveBan(user, chat, reason);
            this.sendMessage(user, chat, reason);
        }
    }

    /**
     * Sends the ban message to the chat.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     *
     * @param user
     * @param chat
     * @param reason
     */
    private async sendMessage(user: users, chat: chats, reason?: string): Promise<void> {

        const message = Lang.get("fedBannedMessage")
            .replace("{userId}", user.user_id.toString())
            .replace("{username}", user.first_name ?? user.username ?? user.user_id.toString())
            .replace("{reason}", reason?.length ? reason : "Unknown");

        const options = {
            user_id: user.user_id,
            chat_id: chat.chat_id,
            text: message,
            parse_mode: "HTML"
        };

        const sendMessage = new SendMessage();
        sendMessage.setOptions(options).post().catch((err) => {
            Log.error(err.toString());
        });
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
    private async saveBan(user: users, chat: chats, reason: string): Promise<void> {
        Lang.set(chat.language || "en");
        await addFederationBan(user.id, chat.id, chat.federation_id!, reason).catch((err) => {
            Log.error(err.message, err.stack);
        });
    }
}
