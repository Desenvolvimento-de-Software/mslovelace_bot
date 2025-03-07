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

import SendMessage from "libraries/telegram/resources/SendMessage";
import SendPhoto from "libraries/telegram/resources/SendPhoto";
import SendChatAction from "libraries/telegram/resources/SendChatAction";
import GetChatAdministrators from "libraries/telegram/resources/GetChatAdministrators";
import Log from "helpers/Log";
import Message from "./Message";
import { Chat as Chatype } from "libraries/telegram/types/Chat";
import { ChatLocation } from "libraries/telegram/types/ChatLocation";
import { ChatPermissions } from "libraries/telegram/types/ChatPermissions";
import { ChatPhoto } from "libraries/telegram/types/ChatPhoto";
import { Message as MessageType } from "libraries/telegram/types/Message";

export default class Chat {

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    private readonly chat: Chatype;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-04
     *
     * @param chat
     */
    public constructor(chat: Chatype) {
        this.chat = chat;
    }

    /**
     * Returns the chat id.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @return {number}
     */
    public getId(): number {
        return this.chat.id;
    }

    /**
     * Returns the chat type.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @return {string}
     */
    public getType(): string {
        return this.chat.type;
    }

    /**
     * Returns the chat title.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @return {string|undefined}
     */
    public getTitle(): string|undefined {
        return this.chat.title;
    }

    /**
     * Returns the chat username.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getUsername(): string|undefined {
        return this.chat.username;
    }

    /**
     * Returns the chat first name.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getFirstName(): string|undefined {
        return this.chat.first_name;
    }

    /**
     * Returns the chat last name.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getLastName(): string|undefined {
        return this.chat.last_name;
    }

    /**
     * Returns whether the chat is a forum or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getIsForum(): boolean|undefined {
        return this.chat.is_forum;
    }

    /**
     * Returns the chat photo.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getPhoto(): ChatPhoto|undefined {
        return this.chat.photo;
    }

    /**
     * Returns the chat description.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getActiveUsernames(): string[]|undefined {
        return this.chat.active_usernames;
    }

    /**
     * Returns the custom emoji id of the chat status.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getEmojiStatusCustomEmojiId(): string|undefined {
        return this.chat.emoji_status_custom_emoji_id;
    }

    /**
     * Returns the chat bio.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getBio(): string|undefined {
        return this.chat.bio;
    }

    /**
     * Returns if the chat has private forwards or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getHasPrivateForwards(): boolean|undefined {
        return this.chat.has_private_forwards;
    }

    /**
     * Returns if chat has voice and video messages restricted or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {boolean|undefined}
     */
    public getHasRestrictedVoiceAndVideoMessages(): boolean|undefined {
        return this.chat.has_restricted_voice_and_video_messages;
    }

    /**
     * Returns the join to send messages status of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {boolean|undefined}
     */
    public getJoinToSendMessages(): boolean|undefined {
        return this.chat.join_to_send_messages;
    }

    /**
     * Returns the join by request status of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {boolean|undefined}
     */
    public getJoinByRequest(): boolean|undefined {
        return this.chat.join_by_request;
    }

    /**
     * Returns the chat description.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getDescription(): string|undefined {
        return this.chat.description;
    }

    /**
     * Returns the chat invite link.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getInviteLink(): string|undefined {
        return this.chat.invite_link;
    }

    /**
     * Returns the pinned message of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {MessageType|undefined}
     */
    public getPinnedMessage(): MessageType|undefined {
        return this.chat.pinned_message;
    }

    /**
     * Returns the chat permissions.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {ChatPermissions|undefined}
     */
    public getPermissions(): ChatPermissions|undefined {
        return this.chat.permissions;
    }

    /**
     * Returns the slow mode delay of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {number|undefined}
     */
    public getSlowModeDelay(): number|undefined {
        return this.chat.slow_mode_delay;
    }

    /**
     * Returns the message auto delete time of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {number|undefined}
     */
    public getMessageAutoDeleteTime(): number|undefined {
        return this.chat.message_auto_delete_time;
    }

    /**
     * Returns if the chat has aggressive anti spam enabled or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {boolean|undefined}
     */
    public getHasAggressiveAntiSpamEnabled(): boolean|undefined {
        return this.chat.has_aggressive_anti_spam_enabled;
    }

    /**
     * Returns if the chat has hidden members or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {boolean|undefined}
     */
    public getHasHiddenMembers(): boolean|undefined {
        return this.chat.has_hidden_members;
    }

    /**
     * Returns if the chat has protected content or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {boolean|undefined}
     */
    public getHasProtectedContent(): boolean|undefined {
        return this.chat.has_protected_content;
    }

    /**
     * Returns the sticker set name of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {string|undefined}
     */
    public getStickerSetName(): string|undefined {
        return this.chat.sticker_set_name;
    }

    /**
     * Returns the can set sticker set status of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {boolean|undefined}
     */
    public getCanSetStickerSet(): boolean|undefined {
        return this.chat.can_set_sticker_set;
    }

    /**
     * Returns the linked chat id of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {number|undefined}
     */
    public getLinkedChatId(): number|undefined {
        return this.chat.linked_chat_id;
    }

    /**
     * Returns the location of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {ChatLocation|undefined}
     */
    public getLocation(): ChatLocation|undefined {
        return this.chat.location;
    }

    /**
     * Returns the chat admins.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @return {Promise<Array<number>>}
     */
    public async getChatAdministrators(): Promise<Array<number>> {

        const request = new GetChatAdministrators();
        request.setChatId(this.chat.id);

        const response = await request.post();
        const json = await response.json();

        if (!json.hasOwnProperty("ok") || json.ok !== true) {
            return [];
        }

        let admins: Array<number> = [];
        for (let i = 0, length = json.result.length; i < length; i++) {
            admins.push(json.result[i].user.id);
        }

        return Promise.resolve(admins);
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
            .setChatId(this.chat.id)
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
            return Promise.resolve();
        }
    }

    /**
     * Sends a photo to the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @param photo
     * @param options
     *
     * @return {Promise<any>}
     */
    public async sendPhoto(photo: Blob, options?: Record<string, any>): Promise<any> {

        const sendPhoto = new SendPhoto();
        sendPhoto
            .setChatId(this.chat.id)
            .setPhoto(photo);

        if (options) {
            sendPhoto.setOptions(options);
        }

        try {

            const response = await sendPhoto.post();
            const json = await response.json();
            return new Message(json.result);

        } catch (error: any) {
            Log.save(error.message, error.stack);
            return Promise.resolve();
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
            .setChatId(this.chat.id)
            .setAction(action);

        try {

            const response = await sendChatAction.post();
            const json = await response.json();
            return new Message(json.result);

        } catch (error: any) {
            Log.save(error.message, error.stack);
        }

        return Promise.resolve();
    }
}
