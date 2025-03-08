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

import Action from "./Action";
import Chat from "contexts/Chat";
import Context from "contexts/Context";
import Log from "helpers/Log";
import { createAndGetChat } from "services/Chats";
import { createAndGetUser } from "services/Users";
import User from "contexts/User";
import { chats, users, PrismaClient } from "@prisma/client";

export default class SaveUserAndChat extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context, "sync");
    }

    /**
     * Runs the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     */
    public async run(): Promise<void> {

        try {

            const user = await this.getUser(this.getContextUser());
            const chat = await this.getChat(this.context.getChat());

            const prisma = new PrismaClient();
            await prisma.rel_users_chats.upsert({
                where: {
                    user_id_chat_id: {
                        user_id: user.id,
                        chat_id: chat.id
                    }
                },
                create: {
                    user_id: user.id,
                    chat_id: chat.id,
                    joined: true,
                    date: Math.floor(Date.now() / 1000),
                    last_seen: Math.floor(Date.now() / 1000)
                },
                update: {
                    joined: true,
                    last_seen: Math.floor(Date.now() / 1000)
                }

            }).catch((err: Error) => {
                Log.save(err.message, err.stack);

            }).finally(async () => {
                await prisma.$disconnect();
            });

        } catch (err: any) {
            Log.save("SaveUserAndChat :: " + err.message, err.stack);
        }
    }

    /**
     * Returns the context user.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     *
     * @throws Error User not found.
     *
     * @return Context user.
     */
    private getContextUser(): User {

        const contextUser = this.context.getNewChatMember() ?? this.context.getLeftChatMember() ?? this.context.getUser();
        if (!contextUser) {
            throw new Error("User not found in the context.");
        }

        return contextUser;
    }

    /**
     * Returns the user.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     *
     * @param contextUser
     *
     * @throws Error User not found.
     *
     * @return User.
     */
    private async getUser(contextUser: User): Promise<users> {

        if (!contextUser) {
            throw new Error("User not found in the context.");
        }

        const user = await createAndGetUser(contextUser);
        if (!user) {
            throw new Error("User not found in the context. " + JSON.stringify(this.context.getPayload()));
        }

        return user;
    }

    /**
     * Returns the context chat.
     *
     * @author Marcos Leandro
     * @since  2025-03-08
     *
     * @param contextChat
     *
     * @throws Error Chat not found.
     *
     * @return Context chat.
     */
    private async getChat(contextChat?: Chat): Promise<chats> {

        if (!contextChat) {
            throw new Error("Chat not found in the context.");
        }

        const chat = await createAndGetChat(contextChat);
        if (!chat) {
            throw new Error("Chat not found in the context. " + JSON.stringify(this.context.getPayload()));
        }

        return chat;
    }
}
