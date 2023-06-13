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

import BanChatMember from "../resource/BanChatMember.js";
import UnbanChatMember from "../resource/UnbanChatMember.js";
import RestrictChatMember from "../resource/RestrictChatMember.js";
import Chat from "./Chat.js";
import { User as UserType } from "../type/User.js";
import { ChatPermissions } from "../type/ChatPermissions.js";

export default class User {

    /**
     * User object.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    private user: UserType;

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    private chat: Chat;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param context
     */
    public constructor(user: UserType, chat: Chat) {
        this.user = user;
        this.chat = chat;
    }

    /**
     * Returns the user id.
     *
     * @author Marcos Leandro
     * @since  2023-06-04
     *
     * @returns
     */
    public getId(): number {
        return this.user.id!;
    }

    /**
     * Returns the user first name.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns
     */
    public getFirstName(): string|undefined {
        return this.user.firstName || undefined;
    }

    /**
     * Returns the user last name.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns
     */
    public getLastName(): string|undefined {
        return this.user.lastName || undefined;
    }

    /**
     * Returns the user username.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns
     */
    public getUsername(): string|undefined {
        return this.user.username || undefined;
    }

    /**
     * Returns the user language code.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getLanguageCode(): string|undefined {
        return this.user.languageCode || undefined;
    }

    /**
     * Returns whether the user is a bot or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean}
     */
    public getIsBot(): boolean {
        return this.user.isBot;
    }

    /**
     * Returns whether the user is premium or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getIsPremium(): boolean|undefined {
        return this.user.isPremium || undefined;
    }

    /**
     * Returns whether the user is added to attachment menu or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getAddedToAttachmentMenu(): boolean|undefined {
        return this.user.addedToAttachmentMenu || undefined;
    }

    /**
     * Returns whether the user can join groups or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getCanJoinGroups(): boolean|undefined {
        return this.user.canJoinGroups || undefined;
    }

    /**
     * Returns whether the user can read all group messages or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getCanReadAllGroupMessages(): boolean|undefined {
        return this.user.canReadAllGroupMessages || undefined;
    }

    /**
     * Returns whether the user supports inline queries or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getSupportsInlineQueries(): boolean|undefined {
        return this.user.supportsInlineQueries || undefined;
    }

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
    public async isAdmin(): Promise<boolean> {

        if (this.chat.getType() === "private") {
            return true;
        }

        const admins = await this.chat.getChatAdministrators();
        return admins.includes(this.user.id);
    }

    /**
     * Bans the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param  untilDate
     */
    public async ban(untilDate?: number): Promise<Record<string, any>> {

        const ban = new BanChatMember();
        ban
            .setUserId(this.getId())
            .setChatId(this.chat.getId());

        if (untilDate) {
            ban.setUntilDate(untilDate);
        }

        return ban.post().then((response) => response.json());
    }

    /**
     * Unbans the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param  onlyIfBanned
     */
    public async unban(onlyIfBanned?: boolean): Promise<Record<string, any>> {

        const unban = new UnbanChatMember();
        unban
            .setUserId(this.getId())
            .setChatId(this.chat.getId());

        if (onlyIfBanned) {
            unban.setOnlyIfBanned(false);
        }

        return unban.post().then((response) => response.json());
    }

    /**
     * Kicks the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    public async kick(): Promise<Record<string, any>> {
        return this.unban(false);
    }

    /**
     * Sets the user permissions.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param permissions
     */
    public async setPermissions(permissions: ChatPermissions, untilDate?: number): Promise<Record<string, any>> {

        const restrictChatMember = new RestrictChatMember();
        restrictChatMember
            .setUserId(this.getId())
            .setChatId(this.chat.getId())
            .setChatPermissions(permissions);

        if (untilDate) {
            const now = Math.ceil(Date.now() / 1000);
            restrictChatMember.setUntilDate(now + untilDate);
        }

        return restrictChatMember
            .post()
            .then((response: Record<string, any>) => response.json());
    }
}
