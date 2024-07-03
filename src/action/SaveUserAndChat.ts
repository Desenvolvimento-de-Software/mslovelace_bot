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

import Action from "./Action.js";
import Context from "../library/telegram/context/Context.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";

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

        const contextUser = this.context.newChatMember || this.context.leftChatMember || this.context.user;
        const user = await UserHelper.getByTelegramId(contextUser.getId());
        const userId = user?.id ?? await UserHelper.createUser(contextUser);

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        const chatId = chat?.id ?? await ChatHelper.createChat(this.context.chat);

        if (!userId) {
            Log.save("User ID not found " + this.context.getPayload());
            return Promise.resolve();
        }

        UserHelper.updateUser(contextUser);
        ChatHelper.updateChat(this.context.chat);

        if (!await this.hasRelationship(userId, chatId)) {
            const query = await this.saveRelationship(userId, chatId);
            return query;
        }

        return await this.updateRelationship(userId, chatId);
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
            .set("checked", 0)
            .where("user_id").equal(userId)
            .and("chat_id").equal(chatId);

        return relUserChat.execute();
    }
}
