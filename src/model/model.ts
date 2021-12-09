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

export default abstract class DefaultModel {
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
   */
  public constructor(table: string) {
    DefaultModel.connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_SCHEMA,
    });

    this.table = table;
  }

  // public select(fields) {

  // }
}
