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
import ChatConfigs from "../model/ChatConfigs.js";
import Log from "./Log.js";

export default class ChatHelper {

    /**
     * Returns the chat by it's ID.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param id
     *
     * @return {Promise<Record<string, any>|undefined>}
     */
    public static async getById(id: number): Promise<Record<string, any>|undefined> {

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
            .leftOuterJoin("chat_configs", "chat_configs.chat_id = chats.id")
            .where("chats.id").equal(id);

        const chat = await chats.execute();
        if (chat.length) {
            return chat[0];
        }

        return undefined;
    }

    /**
     * Returns the chat by the Telegram ID.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param chatId
     *
     * @return {Promise<Record<string, any>|undefined>}
     */
    public static async getByTelegramId(chatId: number): Promise<Record<string, any>|undefined> {

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
            .leftOuterJoin("chat_configs", "chat_configs.chat_id = chats.id")
            .where("chats.chat_id").equal(chatId);

        const chat = await chats.execute();
        if (chat.length) {
            return chat[0];
        }

        return undefined;
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

        const title = chat.getTitle() || chat.getUsername() || (`${chat.getFirstName()} ${chat.getLastName()}`).trim();
        const newChat = new Chats();
        newChat
            .insert()
            .set("chat_id", chat.getId())
            .set("title", title)
            .set("type", chat.getType())
            .set("joined", 1);

        try {

            const result = await newChat.execute();
            const chatId = result.insertId;

            const newChatConfig = new ChatConfigs();
            newChatConfig
                .insert()
                .set("chat_id", chatId);

            await newChatConfig.execute();
            return chatId;

        } catch (err) {
            Log.error(err);
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
    public static async updateChat(chat: Record<string, any>): Promise<number|undefined> {

        const row = await ChatHelper.getByTelegramId(chat.getId());
        if (!row) {
            return;
        }

        const currentChat = new Chats();
        const title = chat.getTitle() || chat.getUsername() || (`${chat.getFirstName()} ${chat.getLastName()}`).trim();

        currentChat
            .update()
            .set("title", title)
            .set("type", chat.getType())
            .set("joined", 1)
            .where("id").equal(row.id);

        try {
            currentChat.execute();

        } catch (err) {
            return;
        }

        return chat.getId();
    }
}
