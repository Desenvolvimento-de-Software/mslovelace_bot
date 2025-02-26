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

import Iinterval from "interface/Iinterval";
import RelUsersChats from "model/RelUsersChats";
import UnbanChatMember from "library/telegram/resource/UnbanChatMember";
import RestrictChatMember from "library/telegram/resource/RestrictChatMember";
import { ChatPermissions as ChatPermissionsType } from "library/telegram/type/ChatPermissions";

type UsersType = {
    user_id: number,
    chat_id: number
};

export default class KickUnverifiedUsers implements Iinterval {

    /**
     * Current interval.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    private readonly interval: NodeJS.Timer;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    public constructor() {
        this.interval = setInterval(this.run, 1000);
    }

    /**
     * Destroys the interval.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    public destroy(): void {
        clearInterval(this.interval);
    }

    /**
     * Interval routines.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    private readonly run = async (): Promise<void> => {

        const users = await this.getUnverifiedUsers();
        if (users.length === 0) {
            return;
        }

        this.kickUsers(users);
        this.unrestrictUsers(users);
    }

    /**
     * Returns the unverified users.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @return {Promise<UsersType[]>}
     */
    private async getUnverifiedUsers(): Promise<UsersType[]> {

        const timestamp = Math.floor(Date.now() / 1000);
        const fields: string[] = [
            "users.user_id",
            "chats.chat_id"
        ];

        const users = new RelUsersChats();
        users
            .select(fields)
            .innerJoin("users", "users.id = rel_users_chats.user_id")
            .innerJoin("chats", "chats.id = rel_users_chats.chat_id")
            .where("rel_users_chats.joined").equal(1)
            .and("rel_users_chats.checked").equal(0)
            .and("rel_users_chats.ttl").isNotNull()
            .and("rel_users_chats.ttl").lessThan(timestamp);

        const results = await users.execute<UsersType[]>();
        return results;
    }

    /**
     * Kicks the users.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param users
     */
    private async kickUsers(users: UsersType[]): Promise<void> {

        users.forEach(async (user) => {
            const unban = new UnbanChatMember();
            unban
                .setUserId(user.user_id)
                .setChatId(user.chat_id)
                .setOnlyIfBanned(false)
                .post();
        });
    }

    /**
     * Unrestricts the users.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param users
     */
    private async unrestrictUsers(users: UsersType[]): Promise<void> {

        const permissions: ChatPermissionsType = {
            can_send_messages: true,
            can_send_audios: true,
            can_send_documents: true,
            can_send_photos: true,
            can_send_videos: true,
            can_send_video_notes: true,
            can_send_voice_notes: true,
            can_send_polls: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
            can_change_info: true,
            can_invite_users: true,
            can_pin_messages: true,
            can_manage_topics: true
        };

        users.forEach(async (user) => {

            const restrictChatMember = new RestrictChatMember();
            restrictChatMember
                .setUserId(user.user_id)
                .setChatId(user.chat_id)
                .setChatPermissions(permissions)
                .post();
        });
    }
}
