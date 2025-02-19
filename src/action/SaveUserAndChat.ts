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
import ChatHelper from "helper/Chat";
import Context from "context/Context";
import Log from "helper/Log";
import RelUsersChats from "model/RelUsersChats";
import UserHelper from "helper/User";

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

        const contextUser = this.context.getNewChatMember() || this.context.getLeftChatMember() || this.context.getUser();
        if (!contextUser) {
            return Promise.resolve();
        }

        const contextUserId = contextUser.getId();
        if (!contextUserId) {
            Log.save("SaveUserAndChat :: User ID not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        const contextChat = this.context.getChat();
        if (!contextChat) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(contextUserId);
        const userId = user?.id ?? await UserHelper.createUser(contextUser);

        if (!userId) {
            Log.save("SaveUserAndChat :: User ID not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            Log.save("SaveUserAndChat :: Chat ID not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        const newChatId = chat?.id ?? await ChatHelper.createChat(contextChat);

        if (!newChatId) {
            Log.save("SaveUserAndChat :: Chat ID not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        UserHelper.updateUser(contextUser);
        ChatHelper.updateChat(contextChat);

        if (!await this.hasRelationship(userId, newChatId)) {
            const query = await this.saveRelationship(userId, newChatId);
            return query;
        }

        return await this.updateRelationship(userId, newChatId);
    }

    /**
     * Returns if the user has a relationship with the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param userId
     * @param chatId
     *
     * @returns {Promise<boolean>}
     */
    private async hasRelationship(userId: number, chatId: number): Promise<boolean> {

        const relUserChat = new RelUsersChats();
        relUserChat
            .select()
            .where("user_id").equal(userId)
            .and("chat_id").equal(chatId)
            .offset(0)
            .limit(1);

        const row = await relUserChat.execute();
        return !!row.length;
    }

    /**
     * Saves the relationship between the user and the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param userId
     * @param chatId
     *
     * @returns {Promise<void>}
     */
    public async saveRelationship(userId: number, chatId: number): Promise<void> {

        const relUserChat = new RelUsersChats();
        relUserChat
            .insert()
            .set("user_id", userId)
            .set("chat_id", chatId)
            .set("date", Math.floor(Date.now() / 1000));

        return relUserChat.execute();
    }

    /**
     * Updates the relationship between the user and the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param userId
     * @param chatId
     *
     * @returns {Promise<void>}
     */
    private async updateRelationship(userId: number, chatId: number): Promise<void> {

        const relUserChat = new RelUsersChats();
        relUserChat
            .update()
            .set("joined", 1)
            .where("user_id").equal(userId)
            .and("chat_id").equal(chatId);

        return relUserChat.execute();
    }
}
