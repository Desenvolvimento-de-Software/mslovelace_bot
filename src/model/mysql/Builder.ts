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

import JoinInterface from "./interface/Join";
import OrderInterface from "./interface/Order";

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
     * Query joins.
     *
     * @author Marcos Leandro
     * @since 2022-09-16
     *
     * @property {Array<JoinInterface>}
     */
    protected joins: Array<JoinInterface> = [];

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
     * @returns {this}
     */
    public set(field: string, value: any): this {
        this.fields.push(field);
        this.values.push(this.parseValue(value));
        return this;
    }

    /**
     * Adds an inner join to the query.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     *
     * @param table
     * @param condition
     *
     * @return {this}
     */
    public innerJoin(table: string, condition: string): this {

        const join: JoinInterface = {
            type: 'inner join',
            table: table,
            condition: condition
        };

        this.joins.push(join);
        return this;
    }

    /**
     * Adds an left join to the query.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     *
     * @param table
     * @param condition
     *
     * @return {this}
     */
     public leftJoin(table: string, condition: string): this {

        const join: JoinInterface = {
            type: 'left join',
            table: table,
            condition: condition
        };

        this.joins.push(join);
        return this;
    }

    /**
     * Adds an left outer join to the query.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     *
     * @param table
     * @param condition
     *
     * @return {this}
     */
     public leftOuterJoin(table: string, condition: string): this {

        const join: JoinInterface = {
            type: 'left outer join',
            table: table,
            condition: condition
        };

        this.joins.push(join);
        return this;
    }

    /**
     * Starts the query conditions.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param field
     *
     * @return {this}
     */
    public where(field: string): this {
        this.conditions.push("where " + field);
        return this;
    }

    /**
     * Adds an "and" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param field
     *
     * @return {this}
     */
    public and(field: string): this {
        this.conditions.push("and " + field);
        return this;
    }

    /**
     * Adds an "or" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param field
     *
     * @return {this}
     */
    public or(field: string): this {
        this.conditions.push("or " + field);
        return this;
    }

    /**
     * Adds an "=" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public equal(value: any): this {
        this.conditions.push("= " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a "<>" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public notEqual(value: any): this {
        this.conditions.push("<> " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a ">" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public greaterThan(value: any): this {
        this.conditions.push("> " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a ">=" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public greaterThanOrEqual(value: any): this {
        this.conditions.push(">= " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a "<" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public lessThan(value: any): this {
        this.conditions.push("< " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a "<=" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public lessThanOrEqual(value: any): this {
        this.conditions.push("<= " + this.parseValue(value));
        return this;
    }

    /**
     * Adds an "in" condition to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public in(value: Array<any>): this {
        this.conditions.push("in " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a "not in" conditionto the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public notIn(value: Array<any>): this {
        this.conditions.push("not in " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a "like" conditionto the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public like(value: string): this {
        this.conditions.push("like " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a "not like" conditionto the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public notLike(value: string): this {
        this.conditions.push("not like " + this.parseValue(value));
        return this;
    }

    /**
     * Adds a "between" conditionto the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param min
     * @param max
     *
     * @return {this}
     */
    public between(min: number, max: number): this {
        this.conditions.push("between " + min + " and " + max);
        return this;
    }

    /**
     * Adds a "is null" conditionto the query.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @return {this}
     */
    public isNull(): this {
        this.conditions.push("is null");
        return this;
    }

    /**
     * Adds a "is not null" conditionto the query.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @return {this}
     */
    public isNotNull(): this {
        this.conditions.push("is not null");
        return this;
    }

    /**
     * Adds a "not between" conditionto the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param min
     * @param max
     *
     * @return {this}
     */
    public notBetween(min: number, max: number): this {
        this.conditions.push("not between " + min + " and " + max);
        return this;
    }

    /**
     * Adds a grouping rule to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public groupBy(field: string): this {
        this.group.push("group by " + field);
        return this;
    }

    /**
     * Adds an ordenation rule to the query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public orderBy(field: string, direction: string): this {

        const order: OrderInterface = {
            field : field,
            direction : direction
        };

        this.order.push(order);
        return this;
    }

    /**
     * Adds the query offset.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public offset(value: number): this {
        this.queryOffset = value;
        return this;
    }

    /**
     * Adds the query limit.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param value
     *
     * @return {this}
     */
    public limit(value: number): this {
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
            for (const val of value) {
                result.push(this.parseValue(val));
            }

            return "(" + result.join(", ") + ")";
        }

        switch (typeof value) {

            case "string":
                return "'" + value.replace(/\n/g, "\\n").replace(/(['"])/g, "\\$1") + "'";

            case "object":
                return JSON.stringify(value);

            default:
                return value;
        }
    }
}
