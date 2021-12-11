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

import Users from "../model/users.js";

export default class UserHelper {

    /**
     * Returns the user by the Telegram ID.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param userId
     *
     * @returns {Promise<any>}
     */
    public static async getUserByTelegramId(userId: number): Promise<any> {

        const users = new Users();

        users
            .select()
            .where("user_id").equal(userId);

        const user = await users.execute();

        if (user.length) {
            return user[0];
        }

        return null;
    }

    /**
     * Creates the user in database.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     *
     * @returns {Promise<any>}
     */
    public static async createUser(payload: Record<string, any>): Promise<any> {

        const newUser = new Users();
        newUser
            .insert()
            .set("user_id", payload.message.from.id)
            .set("first_name", payload.message.from.first_name)
            .set("last_name", payload.message.from.last_name)
            .set("username", payload.message.from.username)
            .set("language_code", payload.message.from.language_code);

        try {

            const result = await newUser.execute();
            return result.insertId;

        } catch (err) {
            return null;
        }
    }

    /**
     * Updates the user in database.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     *
     * @returns {Promise<any>}
     */
    public static async updateUser(payload: Record<string, any>): Promise<any> {

        const user = await UserHelper.getUserByTelegramId(payload.message.from.id);
        const currentUser = new Users();

        currentUser
            .update()
            .set("first_name", payload.message.from.first_name)
            .set("last_name", payload.message.from.last_name)
            .set("username", payload.message.from.username)
            .set("language_code", payload.message.from.language_code)
            .where('user_id').equal(payload.message.from.id);

        try {
            currentUser.execute();

        } catch (err) {
            return null;
        }

        return user.id;
    }
}
