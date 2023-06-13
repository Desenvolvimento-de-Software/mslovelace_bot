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

import { ChatLocation } from "./ChatLocation.js";
import { ChatPermissions } from "./ChatPermissions.js";
import { ChatPhoto } from "./ChatPhoto.js";
import { Message } from "./Message.js";

export type Chat = {
    id: number;
    type: string;
    title?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    isForum?: boolean;
    photo?: ChatPhoto;
    activeUsernames?: string[];
    emojiStatusCustomEmojiId?: string;
    bio?: string;
    hasPrivateForwards?: boolean;
    hasRestrictedVoiceAndVideoMessages?: boolean;
    joinToSendMessages?: boolean;
    joinByRequest?: boolean;
    description?: string;
    inviteLink?: string;
    pinnedMessage?: Message;
    permissions?: ChatPermissions;
    slowModeDelay?: number;
    messageAutoDeleteTime?: number;
    hasAggressiveAntiSpamEnabled?: boolean;
    hasHiddenMembers?: boolean;
    hasProtectedContent?: boolean;
    stickerSetName?: string;
    canSetStickerSet?: boolean;
    linkedChatId?: number;
    location?: ChatLocation;
};
