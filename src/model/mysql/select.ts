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
        const query = `SELECT ${this.parseFields()} FROM ${this.table} ${this.parseConditions()} ${this.parseGroup()} ${this.parseOrder()} ${this.parseLimit()};`;
        return query;
    }

    /**
     *
     * @returns Returns the query fields.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private parseFields(): string {
        return this.fields.join(", ");
    }

    private parseConditions(): string {
        return this.conditions.length ? this.conditions.join(" ") : "";
    }

    private parseGroup(): string {
        return this.group.length ? this.group.join(", ") : "";
    }

    private parseOrder(): string {
        return this.order.length ? this.order.join(", ") : "";
    }

    private parseLimit(): string {

        let limit = [];

        if (this.queryOffset) {
            limit.push(this.queryOffset);
        }

        if (this.queryLimit) {
            limit.push(this.queryLimit);
        }

        return limit.length ? "LIMIT " + limit.join(", ") : "";
    }
}
