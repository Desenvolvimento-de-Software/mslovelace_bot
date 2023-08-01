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

export default class Text {

    /**
     * Formats the text with the given parameters.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param text
     * @param args
     *
     * @returns {string}
     */
    public static format(text: string, ...args: any[]): string {
        return text.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    }

    /**
     * Escapes the markdown characters.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     *
     * @param {string} text
     *
     * @return {string}
     */
    public static markdownEscape(text: string): string {
        return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, "\\$&");
    }

    /**
     * Generates a random string.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {number} length
     *
     * @return {string}
     */
    public static generateRandomString(length: number): string {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }
}
