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

import Chats from "../model/chats.js";

export default class ChatHelper {

    /**
     * Returns the user by the Telegram ID.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param chatId
     *
     * @returns {Promise<any>}
     */
    public static async getChatByTelegramId(chatId: number): Promise<any> {

        const chats = new Chats();

        chats
            .select()
            .where("chat_id").equal(chatId);

        const chat = await chats.execute();

        if (chat.length) {
            return chat[0];
        }

        return null;
    }

    /**
     * Creates the chat in database.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     *
     * @returns {Promise<any>}
     */
    public static async createChat(payload: Record<string, any>): Promise<any> {

        const newChat = new Chats();
        newChat
            .insert()
            .set("chat_id", payload.message.chat.id)
            .set("title", payload.message.chat.title)
            .set("type", payload.message.chat.type)
            .set("joined", 1);

        try {

            const result = await newChat.execute();
            return result.insertId;

        } catch (err) {
            return null;
        }
    }

    /**
     * Updates the chat in database.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     *
     * @returns {Promise<any>}
     */
    public static async updateChat(payload: Record<string, any>): Promise<any> {

        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
        const currentChat = new Chats();

        currentChat
            .update()
            .set("title", payload.message.chat.title)
            .set("type", payload.message.chat.type)
            .set("joined", 1)
            .where("chat_id").equal(payload.message.chat.id);

        try {
            currentChat.execute();

        } catch (err) {
            return null;
        }

        return chat.id;
    }
}
