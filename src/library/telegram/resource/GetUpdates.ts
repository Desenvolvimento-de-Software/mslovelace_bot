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

export default class GetUpdates extends TelegramBotApi {

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
        super("getUpdates");
    }

    /**
     * Sets the offset.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} offset
     *
     * @return {this}
     */
    public setOffset(offset: number): this {
        this.payload.offset = offset;
        return this;
    }

    /**
     * Sets the limit.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} limit
     *
     * @return {this}
     */
    public setLimit(limit: number): this {
        this.payload.limit = limit;
        return this;
    }

    /**
     * Sets the timeout.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} timeout
     *
     * @return {this}
     */
    public setTimeout(timeout: number): this {
        this.payload.timeout = timeout;
        return this;
    }

    /**
     * Sets the allowed updates.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {Array<string>} allowedUpdates
     *
     * @return {this}
     */
    public setAllowedUpdates(allowedUpdates: Array<string>): this {
        this.payload.allowed_updates = allowedUpdates;
        return this;
    }
}
