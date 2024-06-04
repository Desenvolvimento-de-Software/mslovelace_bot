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

export default class SendChatAction extends TelegramBotApi {

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
        super("sendChatAction");
    }

    /**
     * Sets the chat id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} chatId
     *
     * @return {SendChatAction}
     */
    public setChatId(chatId: number): SendChatAction {
        this.payload.chatId = chatId;
        return this;
    }

    /**
     * Sets the message thread id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param messageThreadId
     *
     * @return {SendChatAction}
     */
    public messageThreadId(messageThreadId: number): SendChatAction {
        this.payload.messageThreadId = messageThreadId;
        return this;
    }

    /**
     * Sets the unique identifier of the business connection on behalf of which the action will be sent.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param businessConnectionId
     *
     * @return {SendChatAction}
     */
    public businessConnectionId(businessConnectionId: String): SendChatAction {
        this.payload.businessConnectionId = businessConnectionId;
        return this;
    }

    /**
     * Sets the message action.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {String} text
     *
     * @return {SendChatAction}
     */
    public setAction(action: string): SendChatAction {
        this.payload.action = action;
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
     * @returns {SendChatAction}
     */
    public setOptions(options: Record<string, any>): SendChatAction {

        for (const key in options) {
            this.payload[key] = options[key];
        }

        return this;
    }
}
