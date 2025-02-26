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

import Chats from "model/Chats";
import Federations from "model/Federations";
import RelUsersFederations from "model/RelUsersFederations";
import { Federation as FederationType } from "model/type/Federation";
import { RelUserFederation as RelUserFederationType } from "model/type/RelUserFederation";

export default class FederationHelper {

    /**
     * Returns the federation by it's ID.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {number} id
     *
     * @return {Promise<Record<string, any>>}
     */
    public static async getById(id: number): Promise<Record<string, any>|undefined> {

        const federations = new Federations();
        federations
            .select()
            .where("id").equal(id);

        const federation = await federations.execute<FederationType[]>();
        if (federation.length) {
            return federation[0];
        }

        return undefined;
    }

    /**
     * Returns the federation by it's hash.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {string} hash
     *
     * @return {Promise<Record<string, any>>}
     */
    public static async getByHash(hash: string): Promise<Record<string, any>|undefined> {

        const federations = new Federations();
        federations
            .select()
            .where("hash").equal(hash);

        const federation = await federations.execute<FederationType[]>();
        if (federation.length) {
            return federation[0];
        }

        return undefined;
    }

    /**
     * Returns the federation chats.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {Record<string, any>} federation
     */
    public static async getChats(federation: Record<string, any>): Promise<Record<string, any>[]> {

        const chats = new Chats();
        chats
            .select()
            .where("federation_id").equal(federation.id);

        return await chats.execute();
    }

    /**
     * Returns whether the user is an admin in the federation or not.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param userId
     * @param federation
     *
     * @return {Promise<boolean>}
     */
    public static async isUserAdmin(userId: number, federation: Record<string, any>): Promise<boolean> {

        if (userId === Number(federation.user_id)) {
            return Promise.resolve(true);
        }

        const federationAdmins = new RelUsersFederations();
        federationAdmins
            .select(["user_id"])
            .where("federation_id").equal(federation.id);

        const admins = await federationAdmins.execute<RelUserFederationType[]>();
        if (!admins.length) {
            return Promise.resolve(false);
        }

        let isAdmin = false;
        for (const admin of admins) {
            isAdmin = userId === Number(admin.user_id) ? true : isAdmin;
        }

        return Promise.resolve(isAdmin);
    }
}
