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

import Context from "@library/telegram/context/Context.js";
import Users from "../model/Users.js";

export default class UserHelper {

    /**
     * Returns if the user is an admin.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @param context
     *
     * @returns
     */
    public static async isAdmin(context: Context): Promise<boolean> {

        if (context.chat.getType() === "private") {
            return true;
        }

        const admins = await context.chat.getChatAdministrators();
        return admins.includes(context.user.getId());
    }

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
    public static async createUser(user: Record<string, any>): Promise<any> {

        const newUser = new Users();
        newUser
            .insert()
            .set("user_id", user.id)
            .set("first_name", user.first_name || null)
            .set("last_name", user.last_name || null)
            .set("username", user.username || null)
            .set("language_code", user.language_code || null)
            .set("is_channel", user.id > 0 ? 1 : 0)
            .set("is_bot", user.is_bot || 0);

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
    public static async updateUser(userObject: Record<string, any>): Promise<any> {

        const user = await UserHelper.getUserByTelegramId(userObject.id);
        if (!user) {
            return;
        }

        const currentUser = new Users();

        currentUser
            .update()
            .set("first_name", userObject.first_name || null)
            .set("last_name", userObject.last_name || null)
            .set("username", userObject.username || null)
            .set("language_code", userObject.language_code || "us")
            .where('id').equal(user.id);

        try {
            currentUser.execute();

        } catch (err) {
            return null;
        }

        return user.id;
    }
}
