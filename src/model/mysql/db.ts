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
import Select from "./select";
import Insert from "./insert";
import Replace from "./replace";
import Update from "./update";
import Builder from "./builder";

export default class DB {

    /**
     * Active table.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @property {string}
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
    protected order: Array<string> = [];

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
     * Current operation.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @property {any}
     */
    private operation?: Builder;

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

        DB.connection = mysql.createConnection({
            host     : process.env.MYSQL_HOST,
            user     : process.env.MYSQL_USER,
            password : process.env.MYSQL_PASSWORD,
            database : process.env.MYSQL_SCHEMA
        });

        this.table = table;
    }

    /**
     * Returns a select query builder.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public select(fields?: Array<string>): Builder {
        this.operation = new Select(this.table, fields);
        return this.operation;
    }

    /**
     * Returns an insert query builder.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Insert}
     */
    public insert(): Builder {
        this.operation = new Insert(this.table);
        return this.operation;
    }

    /**
     * Returns a replace query builder.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Replace}
     */
     public replace(): Builder {
        this.operation = new Replace(this.table);
        return this.operation;
    }

    /**
     * Returns an update query builder.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Update}
     */
    public update(): Builder {
        this.operation = new Update(this.table);
        return this.operation;
    }

    // public delete(): DB {
    //     return new Delete(this.table);
    // }

    /**
     * Returns the active table.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {string}
     */
    public getTable(): string {
        return this.table;
    }

    public execute(): any {

        if (this.operation) {
            const query = this.operation.build();
            return query;
        }

        return null;
    }

    public async query(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            DB.connection.query(query, (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }

    /**
     * Returns the active connection.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {mysql.Connection}
     */
    protected connection(): mysql.Connection {
        return DB.connection;
    }
}
