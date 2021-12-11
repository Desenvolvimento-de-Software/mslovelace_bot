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

import Builder from "./Builder.js";

export default class Select extends Builder {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} table
     * @param {Array<string>} fields
     */
    public constructor(table: string, fields?: Array<string>) {
        super(table);
        this.fields = fields || ["*"];
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
        return `SELECT ${this.parseFields()} FROM ${this.table} ${this.parseConditions()} ${this.parseGroup()} ${this.parseOrder()} ${this.parseLimit()};`;
    }

    /**
     * Parses and returns the query fields.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
    private parseFields(): string {
        return this.fields.join(", ");
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
     * Parses and returns the query grouping.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
    private parseGroup(): string {
        return this.group.length ? this.group.join(", ") : "";
    }

    /**
     * Parses and returns the query ordenation.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
    private parseOrder(): string {

        let order = [];
        for (let [key, value] of Object.entries(this.order)) {
            order.push(`${value.field} ${value.direction}`);
        }

        return order.length ? "order by " + order.join(", ") : "";
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
