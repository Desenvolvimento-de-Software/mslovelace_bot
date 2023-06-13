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

export default class EditMessageText extends TelegramBotApi {

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
        super("editMessageText");
    }

    /**
     * Sets the chat id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} chatId
     *
     * @return {EditMessageText}
     */
    public setChatId(chatId: number): EditMessageText {
        this.payload.chat_id = chatId;
        return this;
    }

    /**
     * Sets the message id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} messageId
     *
     * @return {EditMessageText}
     */
    public setMessageId(messageId: number): EditMessageText {
        this.payload.message_id = messageId;
        return this;
    }

    /**
     * Sets the inline message id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} inlineMessageId
     *
     * @return {EditMessageText}
     */
    public setInlineMessageId(inlineMessageId: number): EditMessageText {
        this.payload.inline_message_id = inlineMessageId;
        return this;
    }

    /**
     * Sets the message content.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {String} text
     *
     * @return {EditMessageText}
     */
    public setText(text: string): EditMessageText {
        this.payload.text = text;
        return this;
    }

    /**
     * Sets the parse mode.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {String} parseMode
     *
     * @return {EditMessageText}
     */
    public setParseMode(parseMode: string): EditMessageText {
        this.payload.parse_mode = parseMode;
        return this;
    }

    /**
     * Sets the entitites.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {Array} entities
     *
     * @return {EditMessageText}
     */
    public setEntities(entities: Array<Object>): EditMessageText {
        this.payload.entities = entities;
        return this;
    }

    /**
     * Sets the disable web page preview.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {Boolean} disableWebPagePreview
     *
     * @return {SendMessage}
     */
    public setDisableWebPagePreview(disableWebPagePreview: boolean): EditMessageText {
        this.payload.disable_web_page_preview = disableWebPagePreview;
        return this;
    }

    /**
     * Sets the reply markup.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {Object} replyMarkup
     *
     * @return {EditMessageText}
     */
    public setReplyMarkup(replyMarkup: Object): EditMessageText {
        this.payload.reply_markup = replyMarkup;
        return this;
    }

    /**
     * Sets the message options.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param options
     *
     * @returns {EditMessageText}
     */
    public setOptions(options: Record<string, any>): EditMessageText {

        for (const key in options) {
            this.payload[key] = options[key];
        }

        return this;
    }
}
