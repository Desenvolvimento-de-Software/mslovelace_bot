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
import {SendMessageType} from "./type/SendMessage.js";

export default class SendMessage extends TelegramBotApi {

    /**
     * Method payload.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected payload: SendMessageType = {};

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
     * Sets the chat id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} chat_id
     *
     * @return {SendMessage}
     */
    public setChatId(chatId: number): SendMessage {
        this.payload.chat_id = chatId;
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
     * @return {SendMessage}
     */
    public setText(text: string): SendMessage {
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
     * @return {SendMessage}
     */
    public setParseMode(parseMode: string): SendMessage {
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
     * @return {SendMessage}
     */
    public setEntities(entities: Array<Object>): SendMessage {
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
    public setDisableWebPagePreview(disableWebPagePreview: boolean): SendMessage {
        this.payload.disable_web_page_preview = disableWebPagePreview;
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
     * @return {SendMessage}
     */
    public setDisableNotification(disableNotification: boolean): SendMessage {
        this.payload.disable_notification = disableNotification;
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
     * @return {SendMessage}
     */
    public setReplyToMessageId(replyToMessageId: number): SendMessage {
        this.payload.reply_to_message_id = replyToMessageId;
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
     * @return {SendMessage}
     */
    public setReplyMarkup(replyMarkup: Object): SendMessage {
        this.payload.reply_markup = replyMarkup;
        return this;
    }
}
