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

import { Animation } from "./Animation.js";
import { Audio } from "./Audio.js";
import { Chat } from "./Chat.js";
import { ChatShared } from "./ChatShared.js";
import { Contact } from "./Contact.js";
import { Dice } from "./Dice.js";
import { Document } from "./Document.js";
import { ForumTopicCreated } from "./ForumTopicCreated.js";
import { ForumTopicEdited } from "./ForumTopicEdited.js";
import { ForumTopicClosed } from "./ForumTopicClosed.js";
import { ForumTopicReopened } from "./ForumTopicReopened.js";
import { Game } from "./games/Game.js";
import { GeneralForumTopicHidden } from "./GeneralForumTopicHidden.js";
import { GeneralForumTopicUnhidden } from "./GeneralForumTopicUnhidden.js";
import { Invoice } from "./payments/Invoice.js";
import { Location } from "./Location.js";
import { MessageAutoDeleteTimerChanged } from "./MessageAutoDeleteTimerChanged.js";
import { MessageEntity } from "./MessageEntity.js";
import { PhotoSize } from "./PhotoSize.js";
import { Poll } from "./Poll.js";
import { Sticker } from "./stickers/Sticker.js";
import { User } from "./User.js";
import { UserShared } from "./UserShared.js";
import { Venue } from "./Venue.js";
import { Video } from "./Video.js";
import { VideoNote } from "./VideoNote.js";
import { Voice } from "./Voice.js";
import { InlineKeyboardMarkup } from "./InlineKeyboardMarkup.js";
import { SuccessfulPayment } from "./payments/SuccessfulPayment.js";
import { PassportData } from "./passport/PassportData.js";
import { ProximityAlertTriggered } from "./ProximityAlertTriggered.js";
import { VideoChatScheduled } from "./VideoChatScheduled.js";
import { VideoChatStarted } from "./VideoChatStarted.js";
import { VideoChatEnded } from "./VideoChatEnded.js";
import { VideoChatParticipantsInvited } from "./VideoChatParticipantsInvited.js";
import { WebAppData } from "./WebAppData.js";
import { WriteAccessAllowed } from "./WriteAccessAllowed.js";

export type Message = {
    messageId: number;
    messageThreadId?: number;
    from?: User;
    senderChat?: Chat;
    date: number;
    chat: Chat;
    forwardFrom?: User;
    forwardFromChat?: Chat;
    forwardFromMessageId?: number;
    forwardSignature?: string;
    forwardSenderName?: string
    forwardDate?: number;
    isTopicMessage?: boolean;
    isAutomaticForward?: boolean;
    replyToMessage?: Message;
    viaBot?: User;
    editDate?: number;
    hasProtectedContent?: boolean;
    mediaGroupId?: string;
    authorSignature?: string;
    text?: string;
    entities?: MessageEntity[];
    animation?: Animation;
    audio?: Audio;
    document?: Document;
    photo?: PhotoSize[];
    sticker?: Sticker;
    video?: Video;
    videoNote?: VideoNote;
    voice?: Voice;
    caption?: string;
    captionEntities?: MessageEntity[];
    hasMediaSpoiler?: boolean;
    contact?: Contact;
    dice?: Dice;
    game?: Game;
    poll?: Poll;
    venue?: Venue;
    location?: Location;
    newChatMember?: User;
    newChatMembers?: User[];
    leftChatMember?: User;
    newChatTitle?: string;
    newChatPhoto?: PhotoSize[];
    deleteChatPhoto?: boolean;
    groupChatCreated?: boolean;
    supergroupChatCreated?: boolean;
    channelChatCreated?: boolean;
    messageAutoDeleteTimerChanged?: MessageAutoDeleteTimerChanged;
    migrateToChatId?: number;
    migrateFromChatId?: number;
    pinnedMessage?: Message;
    invoice?: Invoice;
    successfulPayment?: SuccessfulPayment;
    userShared?: UserShared;
    chatShared?: ChatShared;
    connectedWebsite?: string;
    writeAccessAllowed?: WriteAccessAllowed;
    passportData?: PassportData;
    proximityAlertTriggered?: ProximityAlertTriggered;
    forumTopicCreated?: ForumTopicCreated;
    forumTopicEdited?: ForumTopicEdited;
    forumTopicClosed?: ForumTopicClosed;
    forumTopicReopened?: ForumTopicReopened;
    generalForumTopicHidden?: GeneralForumTopicHidden;
    generalForumTopicUnhidden?: GeneralForumTopicUnhidden;
    videoChatScheduled?: VideoChatScheduled;
    videoChatStarted?: VideoChatStarted;
    videoChatEnded?: VideoChatEnded;
    videoChatParticipantsInvited?: VideoChatParticipantsInvited;
    webAppData?: WebAppData;
    replyMarkup?: InlineKeyboardMarkup;
};
