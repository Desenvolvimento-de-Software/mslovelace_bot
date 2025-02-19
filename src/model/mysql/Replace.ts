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

import Insert from "./Insert";

export default class Replace extends Insert {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} table
     */
     public constructor(table: string) {
        super(table);
    }

    /**
     * Returns the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
    public build(): string {
        return `REPLACE INTO ${this.table} (${this.parseFields()}) VALUES (${this.parseValues()});`;
    }
}
