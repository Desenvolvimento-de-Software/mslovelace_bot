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

import BanChatMember from "../libraries/telegram/resources/BanChatMember";
import Chat from "./Chat";
import Log from "helpers/Log";
import Message from "./Message";
import RestrictChatMember from "../libraries/telegram/resources/RestrictChatMember";
import SendMessage from "libraries/telegram/resources/SendMessage";
import SendChatAction from "libraries/telegram/resources/SendChatAction";
import UnbanChatMember from "libraries/telegram/resources/UnbanChatMember";
import { User as UserType } from "libraries/telegram/types/User";
import { ChatPermissions as ChatPermissionsType } from "../libraries/telegram/types/ChatPermissions";

export default class User {

    /**
     * User object.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    private readonly user: UserType;

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    private readonly chat: Chat;

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
        return this.user.id;
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
        return this.user.first_name ?? undefined;
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
        return this.user.last_name ?? undefined;
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
        return this.user.username ?? undefined;
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
        return this.user.language_code ?? undefined;
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
        return this.user.is_bot;
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
        return this.user.is_premium || undefined;
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
        return this.user.added_to_attachment_menu || undefined;
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
        return this.user.can_join_groups || undefined;
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
        return this.user.can_read_all_group_messages || undefined;
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
        return this.user.supports_inline_queries || undefined;
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
     * Sends a message to the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @param text
     * @param options
     *
     * @return {Promise<any>}
     */
    public async sendMessage(text: string, options?: Record<string, any>): Promise<any> {

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(this.user.id)
            .setText(text);

        if (options) {
            sendMessage.setOptions(options);
        }

        try {

            const response = await sendMessage.post();
            const json = await response.json();
            return new Message(json.result);

        } catch (error: any) {
            Log.save(error.message, error.stack);
        }
    }

    /**
     * Sends a chat action to the chat.
     *
     * @author Marcos Leandro
     * @since  2024-05-23
     *
     * @param action
     *
     * @return {Promise<any>}
     */
    public async sendChatAction(action: string): Promise<any> {

        const sendChatAction = new SendChatAction();
        sendChatAction
            .setChatId(this.user.id)
            .setAction(action);

        try {

            const response = await sendChatAction.post();
            const json = await response.json();
            return new Message(json.result);

        } catch (error: any) {
            Log.save(error.message, error.stack);
        }
    }

    /**
     * Bans the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param  untilDate
     */
    public async ban(untilDate?: number): Promise<boolean> {

        const ban = new BanChatMember();
        ban
            .setUserId(this.getId())
            .setChatId(this.chat.getId());

        if (untilDate) {
            ban.setUntilDate(untilDate);
        }

        try {

            const response = await ban.post();
            const json = await response.json();

            return Promise.resolve(json?.ok || false);

        } catch (error) {
            return Promise.resolve(false);
        }
    }

    /**
     * Unbans the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param  onlyIfBanned
     */
    public async unban(onlyIfBanned?: boolean): Promise<boolean> {

        const unban = new UnbanChatMember();
        unban
            .setUserId(this.getId())
            .setChatId(this.chat.getId());

        if (onlyIfBanned) {
            unban.setOnlyIfBanned(false);
        }

        try {

            const response = await unban.post();
            const json = await response.json();

            return Promise.resolve(json?.ok || false);

        } catch (error) {
            return Promise.resolve(false);
        }
    }

    /**
     * Kicks the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    public async kick(): Promise<boolean> {
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
    public async setPermissions(permissions: ChatPermissionsType, untilDate?: number): Promise<Record<string, any>> {

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

    /**
     * Unrestricts the user.
     *
     * @author Marcos Leandro
     * @since  2025-03-07
     *
     * @returns {Promise<boolean>}
     */
    public async unrestrict(): Promise<boolean> {

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

        const restrictChatMember = new RestrictChatMember();
        restrictChatMember
            .setUserId(this.getId())
            .setChatId(this.chat.getId())
            .setChatPermissions(permissions);

        return restrictChatMember
            .post()
            .then((response: Record<string, any>) => response.json());
    }
}
