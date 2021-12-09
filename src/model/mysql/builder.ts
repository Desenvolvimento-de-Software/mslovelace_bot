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

import mysql from "mysql";
import OrderInterface from "./interface/order";

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
     * Active connection.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @property {mysql.Connection}
     */
    private static connection: mysql.Connection;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param table {string}
     */
    constructor(table: string) {
        this.table = table;
    }

    public build(): string {
        return "";
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
        this.conditions.push("= " + value);
        return this;
    }

    public notEqual(value: any): Builder {
        this.conditions.push("<> " + value);
        return this;
    }

    public greaterThan(value: any): Builder {
        this.conditions.push("> " + value);
        return this;
    }

    public greaterThanOrEqual(value: any): Builder {
        this.conditions.push(">= " + value);
        return this;
    }

    public lessThan(value: any): Builder {
        this.conditions.push("< " + value);
        return this;
    }

    public lessThanOrEqual(value: any): Builder {
        this.conditions.push("<= " + value);
        return this;
    }

    public in(value: Array<any>): Builder {
        this.conditions.push("in " + value);
        return this;
    }

    public notIn(value: Array<any>): Builder {
        this.conditions.push("not in " + value);
        return this;
    }

    public like(value: string): Builder {
        this.conditions.push("like " + value);
        return this;
    }

    public notLike(value: string): Builder {
        this.conditions.push("not like " + value);
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
}
