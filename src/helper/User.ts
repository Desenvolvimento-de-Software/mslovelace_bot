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

import User from "../library/telegram/context/User.js";
import Users from "../model/Users.js";

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
     * Returns the user by the username.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param userId
     *
     * @returns {Promise<any>}
     */
    public static async getUserByUsername(username: string): Promise<any> {

        const users = new Users();

        users
            .select()
            .where("username").equal(username);

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
    public static async createUser(user: User): Promise<any> {

        const newUser = new Users();
        newUser
            .insert()
            .set("user_id", user.getId())
            .set("first_name", user.getFirstName() || null)
            .set("last_name", user.getLastName() || null)
            .set("username", user.getUsername() || null)
            .set("language_code", user.getLanguageCode() || "us")
            .set("is_channel", user.getId() > 0 ? 1 : 0)
            .set("is_bot", user.getIsBot() || 0)
            .set("is_premium", user.getIsPremium() || 0);

        try {

            const result = await newUser.execute();
            return result.insertId;

        } catch (err) {
            console.log(err);
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
    public static async updateUser(user: User): Promise<any> {

        const row = await UserHelper.getUserByTelegramId(user.getId());
        if (!row) {
            return;
        }

        const currentUser = new Users();

        currentUser
            .update()
            .set("first_name", user.getFirstName() || null)
            .set("last_name", user.getLastName() || null)
            .set("username", user.getUsername() || null)
            .set("language_code", user.getLanguageCode() || "us")
            .set("is_premium", user.getIsPremium() || 0)
            .where('id').equal(row.id);

        try {
            currentUser.execute();

        } catch (err) {
            return null;
        }

        return row.id;
    }
}
