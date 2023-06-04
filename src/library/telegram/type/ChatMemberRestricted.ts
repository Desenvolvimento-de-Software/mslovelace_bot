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

import { User } from "./User.js";

export type ChatMemberRestricted = {
    status: "restricted";
    user: User;
    isMember: boolean;
    canSendMessages: boolean;
    canSendAudios: boolean;
    canSendDocuments: boolean;
    canSendPhotos: boolean;
    canSendVideos: boolean;
    canSendVideoNotes: boolean;
    canSendVoiceNotes: boolean;
    canSendPolls: boolean;
    canSendOtherMessages: boolean;
    canAddWebPagePreviews: boolean;
    canChangeInfo: boolean;
    canInviteUsers: boolean;
    canPinMessages: boolean;
    canManageTopics: boolean;
    untilDate: number;
}
