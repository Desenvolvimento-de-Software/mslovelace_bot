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

import Builder from "./builder";

export default class Insert extends Builder {

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
        return `INSERT INTO ${this.table} (${this.parseFields()}) VALUES (${this.parseValues()});`;
    }

    /**
     * Parses and returns the query fields.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected parseFields(): string {

        if (!this.fields.length) {
            throw "No fields defined.";
        }

        return this.fields.join(", ");
    }

    /**
     * Parses and returns the query values.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected parseValues(): string {

        if (!this.values.length) {
            throw "No values defined.";
        }

        if (this.values.length !== this.fields.length) {
            throw "Fields and values must have the same length.";
        }

        return this.values.join(", ");
    }
 }
