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
import { InlineKeyboardMarkup } from "../type/InlineKeyboardMarkup.js";

export default class SendMessage extends TelegramBotApi {

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
        super("sendMessage");
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
        this.payload.chatId = chatId;
        return this;
    }

    /**
     * Sets the thread id.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param threadId
     *
     * @return
     */
    public setThreadId(threadId: number): this {
        this.payload.messageThreadId = threadId;
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
        this.payload.parseMode = parseMode;
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
        this.payload.disableWebPagePreview = disableWebPagePreview;
        return this;
    }

    /**
     * Sets the disable notification.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {Boolean} disableNotification
     *
     * @return {this}
     */
    public setDisableNotification(disableNotification: boolean): this {
        this.payload.disableNotification = disableNotification;
        return this;
    }

    /**
     * Sets the reply to message id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} replyToMessageId
     *
     * @return {this}
     */
    public setReplyToMessageId(replyToMessageId: number): this {
        this.payload.replyToMessageId = replyToMessageId;
        return this;
    }

    /**
     * Sets the reply markup.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {InlineKeyboardMarkup} replyMarkup
     *
     * @return {this}
     */
    public setReplyMarkup(replyMarkup: InlineKeyboardMarkup): this {
        this.payload.replyMarkup = replyMarkup;
        return this;
    }
}
