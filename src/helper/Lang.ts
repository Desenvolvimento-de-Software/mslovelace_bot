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
import us from "../lang/us";

export default class Lang {

    /**
     * Default country.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {string}
     */
    private static country = "us";

    /**
     * Langs object.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private static langs: Record<string, any> = {
        br: br,
        us: us
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
    public static get(index: string): any {
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
            throw new Error("Country not found.");
        }

        Lang.country = country;
    }
};
