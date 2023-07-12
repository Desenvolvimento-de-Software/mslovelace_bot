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

import SendMessage from "../resource/SendMessage.js";
import GetChatAdministrators from "../resource/GetChatAdministrators.js";
import Message from "./Message.js";
import { ChatLocation } from "../type/ChatLocation.js";
import { ChatPermissions } from "../type/ChatPermissions.js";
import { ChatPhoto } from "../type/ChatPhoto.js";
import { Message as MessageType } from "../type/Message.js";

export default class Chat {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    private context: MessageType;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-04
     *
     * @param context
     */
    public constructor(context: MessageType) {
        this.context = context;
    }

    /**
     * Returns the chat id.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns {number}
     */
    public getId(): number {
        return this.context.chat.id;
    }

    /**
     * Returns the chat type.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns {string}
     */
    public getType(): string {
        return this.context.chat.type;
    }

    /**
     * Returns the chat title.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns {string|undefined}
     */
    public getTitle(): string|undefined {
        return this.context.chat.title;
    }

    /**
     * Returns the chat username.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getUsername(): string|undefined {
        return this.context.chat.username;
    }

    /**
     * Returns the chat first name.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getFirstName(): string|undefined {
        return this.context.chat.firstName;
    }

    /**
     * Returns the chat last name.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getLastName(): string|undefined {
        return this.context.chat.lastName;
    }

    /**
     * Returns whether the chat is a forum or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getIsForum(): boolean|undefined {
        return this.context.chat.isForum;
    }

    /**
     * Returns the chat photo.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getPhoto(): ChatPhoto|undefined {
        return this.context.chat.photo;
    }

    /**
     * Returns the chat description.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getActiveUsernames(): string[]|undefined {
        return this.context.chat.activeUsernames;
    }

    /**
     * Returns the custom emoji id of the chat status.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getEmojiStatusCustomEmojiId(): string|undefined {
        return this.context.chat.emojiStatusCustomEmojiId;
    }

    /**
     * Returns the chat bio.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getBio(): string|undefined {
        return this.context.chat.bio;
    }

    /**
     * Returns if the chat has private forwards or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getHasPrivateForwards(): boolean|undefined {
        return this.context.chat.hasPrivateForwards;
    }

    /**
     * Returns if chat has voice and video messages restricted or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getHasRestrictedVoiceAndVideoMessages(): boolean|undefined {
        return this.context.chat.hasRestrictedVoiceAndVideoMessages;
    }

    /**
     * Returns the join to send messages status of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getJoinToSendMessages(): boolean|undefined {
        return this.context.chat.joinToSendMessages;
    }

    /**
     * Returns the join by request status of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getJoinByRequest(): boolean|undefined {
        return this.context.chat.joinByRequest;
    }

    /**
     * Returns the chat description.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getDescription(): string|undefined {
        return this.context.chat.description;
    }

    /**
     * Returns the chat invite link.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getInviteLink(): string|undefined {
        return this.context.chat.inviteLink;
    }

    /**
     * Returns the pinned message of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {MessageType|undefined}
     */
    public getPinnedMessage(): MessageType|undefined {
        return this.context.chat.pinnedMessage;
    }

    /**
     * Returns the chat permissions.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {ChatPermissions|undefined}
     */
    public getPermissions(): ChatPermissions|undefined {
        return this.context.chat.permissions;
    }

    /**
     * Returns the slow mode delay of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {number|undefined}
     */
    public getSlowModeDelay(): number|undefined {
        return this.context.chat.slowModeDelay;
    }

    /**
     * Returns the message auto delete time of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {number|undefined}
     */
    public getMessageAutoDeleteTime(): number|undefined {
        return this.context.chat.messageAutoDeleteTime;
    }

    /**
     * Returns if the chat has aggressive anti spam enabled or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getHasAggressiveAntiSpamEnabled(): boolean|undefined {
        return this.context.chat.hasAggressiveAntiSpamEnabled;
    }

    /**
     * Returns if the chat has hidden members or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getHasHiddenMembers(): boolean|undefined {
        return this.context.chat.hasHiddenMembers;
    }

    /**
     * Returns if the chat has protected content or not.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getHasProtectedContent(): boolean|undefined {
        return this.context.chat.hasProtectedContent;
    }

    /**
     * Returns the sticker set name of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {string|undefined}
     */
    public getStickerSetName(): string|undefined {
        return this.context.chat.stickerSetName;
    }

    /**
     * Returns the can set sticker set status of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean|undefined}
     */
    public getCanSetStickerSet(): boolean|undefined {
        return this.context.chat.canSetStickerSet;
    }

    /**
     * Returns the linked chat id of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {number|undefined}
     */
    public getLinkedChatId(): number|undefined {
        return this.context.chat.linkedChatId;
    }

    /**
     * Returns the location of the chat.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {ChatLocation|undefined}
     */
    public getLocation(): ChatLocation|undefined {
        return this.context.chat.location;
    }

    /**
     * Returns the chat admins.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns
     */
    public async getChatAdministrators(): Promise<Array<number>> {

        const request = new GetChatAdministrators();
        request.setChatId(this.context.chat.id);

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
     * @param parseMode
     *
     * @returns {Promise<Message>}
     */
    public async sendMessage(text: string, options?: Record<string, any>): Promise<any> {

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(this.context.chat.id)
            .setText(text);

        if (options) {
            sendMessage.setOptions(options);
        }

        return sendMessage
            .post()
            .then((response) => response.json())
            .then((json) => new Message(json.result));
    }
}
