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

export default class BanChatMember extends TelegramBotApi {

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
        super("banChatMember");
    }

    /**
     * Sets the chat id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} User Telegram ID
     *
     * @return {BanChatMember}
     */
     public setUserId(userId: number): BanChatMember {
        this.payload.user_id = userId;
        return this;
    }

    /**
     * Sets the chat id.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} Chat Telegram ID
     *
     * @return {BanChatMember}
     */
     public setChatId(chatId: number): BanChatMember {
        this.payload.chat_id = chatId;
        return this;
    }

    /**
     * Sets the ban until date.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} untilDate
     *
     * @return {BanChatMember}
     */
    public setUntilDate(untilDate: number): BanChatMember {
        this.payload.until_date = untilDate;
        return this;
    }

    /**
     * Sets the message revoking.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {boolean} revokeMessages
     *
     * @return {BanChatMember}
     */
    public setRevokeMessages(revokeMessages: boolean): BanChatMember {
        this.payload.revoke_messages = revokeMessages;
        return this;
    }
}
