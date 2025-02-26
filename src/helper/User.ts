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

import User from "context/User";
import Users from "model/Users";
import Log from "./Log";
import { User as UserType } from "model/type/User";
import { ResultSetHeader } from "mysql2";

export default class UserHelper {

    /**
     * Returns the user by the Telegram ID.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param userId
     *
     * @returns {Promise<UserType|undefined>}
     */
    public static async getByTelegramId(userId: number): Promise<UserType|undefined> {

        const users = new Users();
        users
            .select()
            .where("user_id").equal(userId);

        const user = await users.execute<UserType[]>();
        if (user.length) {
            return user[0];
        }

        users
            .insert()
            .set("user_id", userId)
            .set("first_name", null)
            .set("last_name", null)
            .set("username", null)
            .set("language_code", "us")
            .set("is_channel", 0)
            .set("is_bot", 0)
            .set("is_premium", 0);

        try {

            users.execute<UserType[]>();
            return await this.getByTelegramId(userId);

        } catch (err) {
            Log.error(err);
            return undefined;
        }
    }

    /**
     * Returns the user by the username.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param userId
     *
     * @returns {Promise<UserType|undefined>}
     */
    public static async getUserByUsername(username: string): Promise<UserType|undefined> {

        const users = new Users();

        users
            .select()
            .where("username").equal(username);

        const user: UserType[] = await users.execute();

        if (user.length) {
            return user[0];
        }

        return undefined;
    }

    /**
     * Creates the user in database.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     *
     * @returns {Promise<number|undefined>}
     */
    public static async createUser(user: User): Promise<number|undefined> {

        const newUser = new Users();
        newUser
            .insert()
            .set("user_id", user.getId())
            .set("first_name", user.getFirstName() ?? null)
            .set("last_name", user.getLastName() ?? null)
            .set("username", user.getUsername() ?? null)
            .set("language_code", user.getLanguageCode() ?? "en")
            .set("is_channel", user.getId() > 0 ? 0 : 1)
            .set("is_bot", user.getIsBot() ?? 0)
            .set("is_premium", user.getIsPremium() ?? 0);

        try {

            const result = await newUser.execute<ResultSetHeader>();
            return result.insertId;

        } catch (err) {
            Log.error(err);
            return undefined;
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
     * @returns {Promise<number|undefined>}
     */
    public static async updateUser(user: User): Promise<number|undefined> {

        const row = await UserHelper.getByTelegramId(user.getId());
        if (!row) {
            return undefined;
        }

        const currentUser = new Users();

        currentUser
            .update()
            .set("first_name", user.getFirstName() ?? null)
            .set("last_name", user.getLastName() ?? null)
            .set("username", user.getUsername() ?? null)
            .set("language_code", user.getLanguageCode() ?? "en")
            .set("is_premium", user.getIsPremium() ?? 0)
            .where('id').equal(row.id);

        try {
            await currentUser.execute();
            return row.id;

        } catch (err) {
            return undefined;
        }
    }
}
