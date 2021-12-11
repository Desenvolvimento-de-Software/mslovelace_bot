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

import OrderInterface from "./interface/order.js";

export default abstract class Builder {

    /**
     * Query table.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {string}
     */
    protected table: string;

    /**
     * Database fields.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @property {Array<string>}
     */
    protected fields: Array<string> = [];

    /**
     * Database values.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @property {Array<string>}
     */
    protected values: Array<any> = [];

    /**
     * Query conditions.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @property {Array<any>}
     */
    protected conditions: Array<any> = [];

    /**
     * Query grouping rules.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected group: Array<string> = [];

    /**
     * Query ordenation.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected order: Array<OrderInterface> = [];

    /**
     * Query offset.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected queryOffset?: number;

    /**
     * Query limit.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected queryLimit?: number;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} table
     */
    constructor(table: string) {
        this.table = table;
    }

    /**
     * Returns an empty query, as this is an abstract class.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
    public build(): string {
        return "";
    }

    /**
     * Sets the fields to insert/replace/update statements.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} field
     * @param {string} value
     *
     * @returns {Builder}
     */
    public set(field: string, value: any): Builder {
        this.fields.push(field);
        this.values.push(this.parseValue(value));
        return this;
    }

    public where(field: string): Builder {
        this.conditions.push("where " + field);
        return this;
    }

    public and(field: string): Builder {
        this.conditions.push("and " + field);
        return this;
    }

    public or(field: string): Builder {
        this.conditions.push("or " + field);
        return this;
    }

    public equal(value: any): Builder {
        this.conditions.push("= " + this.parseValue(value));
        return this;
    }

    public notEqual(value: any): Builder {
        this.conditions.push("<> " + this.parseValue(value));
        return this;
    }

    public greaterThan(value: any): Builder {
        this.conditions.push("> " + this.parseValue(value));
        return this;
    }

    public greaterThanOrEqual(value: any): Builder {
        this.conditions.push(">= " + this.parseValue(value));
        return this;
    }

    public lessThan(value: any): Builder {
        this.conditions.push("< " + this.parseValue(value));
        return this;
    }

    public lessThanOrEqual(value: any): Builder {
        this.conditions.push("<= " + this.parseValue(value));
        return this;
    }

    public in(value: Array<any>): Builder {
        this.conditions.push("in " + this.parseValue(value));
        return this;
    }

    public notIn(value: Array<any>): Builder {
        this.conditions.push("not in " + this.parseValue(value));
        return this;
    }

    public like(value: string): Builder {
        this.conditions.push("like " + this.parseValue(value));
        return this;
    }

    public notLike(value: string): Builder {
        this.conditions.push("not like " + this.parseValue(value));
        return this;
    }

    public between(min: number, max: number): Builder {
        this.conditions.push("between " + min + " and " + max);
        return this;
    }

    public notBetween(min: number, max: number): Builder {
        this.conditions.push("not between " + min + " and " + max);
        return this;
    }

    public groupBy(field: string): Builder {
        this.group.push("group by " + field);
        return this;
    }

    public orderBy(field: string, direction: string): Builder {

        const order: OrderInterface = {
            field     : field,
            direction : direction
        };

        this.order.push(order);
        return this;
    }

    public offset(value: number): Builder {
        this.queryOffset = value;
        return this;
    }

    public limit(value: number): Builder {
        this.queryLimit = value;
        return this;
    }

    /**
     * Parses the query value.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {any} value
     *
     * @returns {string|number}
     */
    protected parseValue(value: any): string|number {

        if (Array.isArray(value)) {

            let result = [];

            for (let i = 0; i < value.length; i++) {
                result.push(this.parseValue(value[i]));
            }

            return "(" + result.join(", ") + ")";
        }

        switch (typeof value) {

            case "string":
                return `'${value}'`;

            case "object":
                return JSON.stringify(value);

            default:
                return value;
        }
    }
}
