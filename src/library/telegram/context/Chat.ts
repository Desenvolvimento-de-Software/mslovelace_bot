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

import { Message as MessageType } from "../type/Message.js";

export default class Chat {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    private context: MessageType;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-04
     *
     * @param context
     */
    public constructor(context: MessageType) {
        this.context = context;
    }
}