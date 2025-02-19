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
     * @return {this}
     */
    public setChatId(chatId: number): this {
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
     * @return {this}
     */
    public setMessageId(messageId: number): this {
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
     * @return {this}
     */
    public setInlineMessageId(inlineMessageId: number): this {
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
     * @return {this}
     */
    public setText(text: string): this {
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
     * @return {this}
     */
    public setParseMode(parseMode: string): this {
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
     * @return {this}
     */
    public setEntities(entities: Array<Object>): this {
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
     * @return {this}
     */
    public setDisableWebPagePreview(disableWebPagePreview: boolean): this {
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
     * @return {this}
     */
    public setReplyMarkup(replyMarkup: Object): this {
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
     * @returns {this}
     */
    public setOptions(options: Record<string, any>): this {

        for (const key in options) {
            this.payload[key] = options[key];
        }

        return this;
    }
}
