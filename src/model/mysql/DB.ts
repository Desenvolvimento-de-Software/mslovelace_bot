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

import mysql from "mysql2";
import Select from "./Select.js";
import Insert from "./Insert.js";
import Replace from "./Replace.js";
import Update from "./Update.js";
import Delete from "./Delete.js";
import Builder from "./Builder.js";

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

    /**
     * Returns a delete query builder.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {Update}
     */
    public delete(): Builder {
        this.operation = new Delete(this.table);
        return this.operation;
    }

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

    /**
     * Perform an operation from the query builder.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns
     */
    public execute(): any {
        if (this.operation) {
            const query = this.operation.build();
            return this.query(query);
        }

        return null;
    }

    /**
     * Executes the given query.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public async query(query: string): Promise<any> {
        return await new Promise((resolve, reject) => {
            this.connection().query(query, (error, results) => {
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

        if (!DB.connection) {
            DB.connection = mysql.createConnection({
                host     : process.env.MYSQL_HOST,
                user     : process.env.MYSQL_USER,
                password : process.env.MYSQL_PASSWORD,
                database : process.env.MYSQL_SCHEMA,
                charset  : process.env.MYSQL_CHARSET
            });
        }

        return DB.connection;
    }
}
