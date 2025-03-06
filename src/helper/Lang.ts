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

import br from "../lang/br";
import en from "../lang/en";

export default class Lang {

    /**
     * Default country.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {string}
     */
    private static country = "en";

    /**
     * Langs object.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private static readonly langs: Record<string, any> = {
        br: br,
        en: en
    };

    /**
     * Returns the lang.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} index
     *
     * @return {string}
     */
    public static get(index: string): string {
        return Lang.langs[Lang.country][index] || index;
    }

    /**
     * Sets the active country.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @throws {Error}
     */
    public static set(country: string) {

        if (!Lang.langs.hasOwnProperty(country)) {
            Lang.country = "en";
            return;
        }

        Lang.country = country;
    }
};
