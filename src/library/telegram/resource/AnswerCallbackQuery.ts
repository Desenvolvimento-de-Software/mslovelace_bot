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

import TelegramBotApi from "../TelegramBotApi.js";

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
     * @return {AnswerCallbackQuery}
     */
    public setCallbackQueryId(callbackQueryId: number): AnswerCallbackQuery {
        this.payload.callbackQueryId = callbackQueryId;
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
     * @return {AnswerCallbackQuery}
     */
    public setText(text: string): AnswerCallbackQuery {
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
     * @return {AnswerCallbackQuery}
     */
    public setShowAlert(showAlert: boolean): AnswerCallbackQuery {
        this.payload.showAlert = showAlert;
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
     * @return {AnswerCallbackQuery}
     */
    public setUrl(url: string): AnswerCallbackQuery {
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
     * @return {AnswerCallbackQuery}
     */
    public setCacheTime(time: number): AnswerCallbackQuery {
        this.payload.cacheTime = time;
        return this;
    }
}
