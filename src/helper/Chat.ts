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

import Chats from "../model/Chats.js";

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

        const fields = [
            "chats.*",
            "chat_configs.greetings",
            "chat_configs.goodbye",
            "chat_configs.warn_name_changing",
            "chat_configs.remove_event_messages",
            "chat_configs.restrict_new_users",
            "chat_configs.captcha",
            "chat_configs.warn_ask_to_ask",
            "chat_configs.adashield"
        ];

        const chats = new Chats();
        chats
            .select(fields)
            .innerJoin("chat_configs", "chat_configs.chat_id = chats.id")
            .where("chats.chat_id").equal(chatId);

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
    public static async createChat(chat: Record<string, any>): Promise<any> {

        const title = chat.title || chat.username || (`${chat.first_name} ${chat.last_name}`).trim();
        const newChat = new Chats();
        newChat
            .insert()
            .set("chat_id", chat.id)
            .set("title", title)
            .set("type", chat.type)
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
    public static async updateChat(chatObject: Record<string, any>): Promise<any> {

        const chat = await ChatHelper.getChatByTelegramId(chatObject.id);
        const currentChat = new Chats();

        const title = chat.title || chat.username || (`${chat.first_name} ${chat.last_name}`).trim();

        currentChat
            .update()
            .set("title", title)
            .set("type", chatObject.type)
            .set("joined", 1)
            .where("chat_id").equal(chatObject.id);

        try {
            currentChat.execute();

        } catch (err) {
            return null;
        }

        return chat.id;
    }
}
