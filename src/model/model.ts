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

import DB from "@model/mysql/db";

export default abstract class DefaultModel extends DB {
  /**
   * The constructor.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   */
  public constructor(table: string) {
    super(table);
  }
}
