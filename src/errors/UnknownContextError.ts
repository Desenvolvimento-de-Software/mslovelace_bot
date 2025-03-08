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

export default class UnknownContextError extends Error {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @param {string} message
     */
    constructor(message: string) {
        super(message);
        this.name = "UnknownContextError";
    }
}
