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

import { Animation } from "./Animation";
import { Audio } from "./Audio";
import { Chat } from "./Chat";
import { ChatShared } from "./ChatShared";
import { Contact } from "./Contact";
import { Dice } from "./Dice";
import { Document } from "./Document";
import { ForumTopicCreated } from "./ForumTopicCreated";
import { ForumTopicEdited } from "./ForumTopicEdited";
import { ForumTopicClosed } from "./ForumTopicClosed";
import { ForumTopicReopened } from "./ForumTopicReopened";
import { Game } from "./games/Game";
import { GeneralForumTopicHidden } from "./GeneralForumTopicHidden";
import { GeneralForumTopicUnhidden } from "./GeneralForumTopicUnhidden";
import { Invoice } from "./payments/Invoice";
import { Location } from "./Location";
import { MessageAutoDeleteTimerChanged } from "./MessageAutoDeleteTimerChanged";
import { MessageEntity } from "./MessageEntity";
import { PhotoSize } from "./PhotoSize";
import { Poll } from "./Poll";
import { Sticker } from "./stickers/Sticker";
import { User } from "./User";
import { UserShared } from "./UserShared";
import { Venue } from "./Venue";
import { Video } from "./Video";
import { VideoNote } from "./VideoNote";
import { Voice } from "./Voice";
import { InlineKeyboardMarkup } from "./InlineKeyboardMarkup";
import { SuccessfulPayment } from "./payments/SuccessfulPayment";
import { PassportData } from "./passport/PassportData";
import { ProximityAlertTriggered } from "./ProximityAlertTriggered";
import { VideoChatScheduled } from "./VideoChatScheduled";
import { VideoChatStarted } from "./VideoChatStarted";
import { VideoChatEnded } from "./VideoChatEnded";
import { VideoChatParticipantsInvited } from "./VideoChatParticipantsInvited";
import { WebAppData } from "./WebAppData";
import { WriteAccessAllowed } from "./WriteAccessAllowed";

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
