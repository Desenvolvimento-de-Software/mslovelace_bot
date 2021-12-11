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

import Builder from "./builder.js";

export default class Update extends Builder {

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
        return `UPDATE ${this.table} SET ${this.parseFields()} ${this.parseConditions()} ${this.parseLimit()};`;
    }

    /**
     * Parses and returns the query fields/values.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private parseFields(): string {

        if (!this.fields.length) {
            throw "No fields to update";
        }

        if (this.fields.length !== this.values.length) {
            throw "Fields and values must have the same length";
        }

        let fields = [];

        for (let i = 0, l = this.fields.length; i < l; i++) {
            fields.push(`${this.fields[i]} = ${this.values[i]}`);
        }

        return fields.join(", ");
    }

    /**
     * Parses and returns the query conditions.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
     private parseConditions(): string {
        return this.conditions.length ? this.conditions.join(" ") : "";
    }

    /**
     * Parses and returns the query offset and limit.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
     private parseLimit(): string {

        let limit = [];

        if (typeof this.queryOffset !== "undefined") {
            limit.push(this.queryOffset);
        }

        if (typeof this.queryLimit !== "undefined") {
            limit.push(this.queryLimit);
        }

        return limit.length ? "LIMIT " + limit.join(", ") : "";
    }
}
