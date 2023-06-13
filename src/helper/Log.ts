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

import fs from "fs";
import path from "path";

export default class Log {

    /**
     * Saves an entry to the log.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {string}  content
     * @param {boolean} print
     */
    public static append(content: string, print?: boolean): void {

        const date = new Date();

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");

        const hours = (date.getHours()).toString().padStart(2, "0");
        const minutes = (date.getMinutes()).toString().padStart(2, "0");
        const seconds = (date.getSeconds()).toString().padStart(2, "0");

        const directory = path.resolve();
        const filename = `${year}-${month}-${day}.log`;
        fs.appendFileSync(`${directory}/log/${filename}`, `${hours}:${minutes}:${seconds} :: ${content}\n`);

        !print || console.log(content);
    }
}
