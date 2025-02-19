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

import Chat from "./Chat";
import Message from "./Message";
import User from "./User";
import AnswerCallbackQuery from "library/telegram/resource/AnswerCallbackQuery";

export default class CallbackQuery {

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    public chat: Chat;

    /**
     * Message object.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    public message: Message;

    /**
     * User Object.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    public user: User;

    /**
     * Callback data.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    public callbackData: Record<string, any>;

    /**
     * The payload.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    private readonly payload: Record<string, any>;

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
        this.chat = new Chat(this.payload.callback_query);
        this.message = new Message(this.payload.callback_query);
        this.user = new User(this.payload.callback_query.from, this.chat);

        try {
            this.callbackData = JSON.parse(this.payload.callback_query.data);

        } catch (err) {
            this.callbackData = this.payload.callback_query.data;
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
            .setCallbackQueryId(this.payload.callback_query.id)
            .setText(content);

        return answer
            .post()
            .then((response) => response.json())
            .then((json) => new Message(json.result));
    }
}
