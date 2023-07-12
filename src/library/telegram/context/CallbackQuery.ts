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

import Chat from "./Chat.js";
import Message from "./Message.js";
import User from "./User.js";
import AnswerCallbackQuery from "../resource/AnswerCallbackQuery.js";

export default class CallbackQuery {

    public chat: Chat;
    public message: Message;
    public user: User;
    public callbackData: Record<string, any>;
    private payload: Record<string, any>;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param context
     */
    public constructor(payload: Record<string, any>) {
        this.payload = payload;
        this.chat = new Chat(this.payload.callbackQuery);
        this.message = new Message(this.payload.callbackQuery);
        this.user = new User(this.payload.callbackQuery.from!, this.chat);

        try {
            this.callbackData = JSON.parse(this.payload.callbackQuery.data);

        } catch (err) {
            this.callbackData = this.payload.callbackQuery.data;
        }
    }

    /**
     * Returns the callback query id.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @return {number}
     */
    public getId(): number {
        return this.payload.callbackQuery.id;
    }

    /**
     * Answers a callback query.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {string} content
     */
    public async answer(content: string): Promise<any> {

        const answer = new AnswerCallbackQuery();
        answer
            .setCallbackQueryId(this.payload.callbackQuery.id)
            .setText(this.callbackData.data.package.toUpperCase());

        return answer
            .post()
            .then((response) => response.json())
            .then((json) => new Message(json.result));
    }
}
