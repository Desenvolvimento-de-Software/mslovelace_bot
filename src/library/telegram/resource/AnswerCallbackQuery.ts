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

import TelegramBotApi from "../TelegramBotApi";

export default class AnswerCallbackQuery extends TelegramBotApi {

    /**
     * Method payload.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected payload: Record<string, any> = {};

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public constructor() {
        super("answerCallbackQuery");
    }

    /**
     * Defines the callback query ID.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param callbackQueryId
     *
     * @return {this}
     */
    public setCallbackQueryId(callbackQueryId: string): this {
        this.payload.callback_query_id = callbackQueryId;
        return this;
    }

    /**
     * Defines the answer text.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param text
     *
     * @return {this}
     */
    public setText(text: string): this {
        this.payload.text = text;
        return this;
    }

    /**
     * Defines whether the alert will be shown or not.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param showAlert
     *
     * @return {this}
     */
    public setShowAlert(showAlert: boolean): this {
        this.payload.show_alert = showAlert;
        return this;
    }

    /**
     * Defines the answer URL.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param showAlert
     *
     * @return {this}
     */
    public setUrl(url: string): this {
        this.payload.url = url;
        return this;
    }

    /**
     * Defines the answer cache time.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param showAlert
     *
     * @return {this}
     */
    public setCacheTime(time: number): this {
        this.payload.cache_time = time;
        return this;
    }
}
