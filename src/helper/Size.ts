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

 export default class Size {

    /**
     * Returns the parsed filesize.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param size Raw filesize.
     *
     * @return Parsed filesize.
     */
    public static disk(size: number): string {

        const steps = ["B", "KB", "MB", "GB", "TB"];
        let i = 0;

        while (size > 1024) {
            size /= 1024;
            i++;
        }

        if (typeof steps[i] === "undefined") {
            return "∞";
        }

        return size.toFixed(2) + " " + steps[i];
    }
}
