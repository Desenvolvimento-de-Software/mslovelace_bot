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

import AnswerCallbackQuery from "libraries/telegram/resources/AnswerCallbackQuery";
import Context from "contexts/Context";
import Message from "contexts/Message";
import { Error as ErrorType } from "libraries/telegram/types/Error";
import { Update as UpdateType } from "libraries/telegram/types/Update";

export default class CallbackQuery extends Context {

    /**
     * The callback query id.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @var {number}
     */
    protected id: string;

    /**
     * The callback query payload.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @var {Record<string, unknown>}
     */
    protected data: Record<string, unknown>|undefined;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param context
     */
    public constructor(type: string, payload: UpdateType) {
        super(type, payload);
        this.id = this.payload.callback_query!.id;

    }

    /**
     * Returns the callback query id.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @return {string}
     */
    public getId(): string {
        return this.id;
    }

    /**
     * Returns the callback query data.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @return {Record<string, unknown>|undefined}
     */
    public getData(): Record<string, unknown>|undefined {
        return this.data;
    }

    /**
     * Sets the callback query data.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param {string} data
     */
    public setData(data: string): void {

        try {
            this.data = JSON.parse(data);
        } catch (error) {}
    }

    /**
     * Answers a callback query.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {string} content
     */
    public async answer(content: string): Promise<Message|ErrorType> {

        const answer = new AnswerCallbackQuery();
        answer
            .setCallbackQueryId(this.getId())
            .setText(content);

        return answer
            .post()
            .then((response) => response.json())
            .then((json) => new Message(json.result))
            .catch((error) => error);
    }
}
