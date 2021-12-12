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
        return text.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != "undefined" ? args[number] : match;
        });
    }
}
