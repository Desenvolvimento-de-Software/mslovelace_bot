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
import { ChatPermissions } from "../types/ChatPermissions";

export default class RestrictChatMember extends TelegramBotApi {

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
        super("restrictChatMember");
    }

    /**
     * Sets the chat id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} User Telegram ID
     *
     * @return {this}
     */
     public setUserId(userId: number): this {
        this.payload.user_id = userId;
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
        this.payload.chat_id = chatId;
        return this;
    }

    /**
     * Sets the chat permissions.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {ChatPermissions} chatPermissions
     *
     * @return {this}
     */
    public setChatPermissions(chatPermissions: ChatPermissions): this {
        this.payload.permissions = chatPermissions;
        return this;
    }

    /**
     * Sets the until date.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} untilDate
     *
     * @return {this}
     */
    public setUntilDate(untilDate: number): this {
        this.payload.until_date = untilDate;
        return this;
    }
}
