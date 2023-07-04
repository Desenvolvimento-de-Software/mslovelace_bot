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

import Federations from "../model/Federations.js";

export default class FederationHelper {

    /**
     * Returns the federation by the hash.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {string} hash
     *
     * @return {Promise<Record<string, any>>}
     */
    public static async getByHash(hash: string): Promise<Record<string, any>|null> {

        const federations = new Federations();
        federations
            .select()
            .where("hash").equal(hash);

        const federation = await federations.execute();
        if (federation.length) {
            return federation[0];
        }

        return null;
    }
}
