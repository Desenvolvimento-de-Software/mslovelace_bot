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
    message_id: number;
    message_thread_id?: number;
    from?: User;
    sender_chat?: Chat;
    date: number;
    chat: Chat;
    forward_from?: User;
    forward_from_chat?: Chat;
    forward_from_message_id?: number;
    forward_signature?: string;
    forward_sender_name?: string
    forward_date?: number;
    is_topic_message?: boolean;
    is_automatic_forward?: boolean;
    reply_to_message?: Message;
    via_bot?: User;
    edit_date?: number;
    has_protected_content?: boolean;
    media_group_id?: string;
    author_signature?: string;
    text?: string;
    entities?: MessageEntity[];
    animation?: Animation;
    audio?: Audio;
    document?: Document;
    photo?: PhotoSize[];
    sticker?: Sticker;
    video?: Video;
    video_note?: VideoNote;
    voice?: Voice;
    caption?: string;
    caption_entities?: MessageEntity[];
    has_media_spoiler?: boolean;
    contact?: Contact;
    dice?: Dice;
    game?: Game;
    poll?: Poll;
    venue?: Venue;
    location?: Location;
    new_chat_member?: User;
    new_chat_members?: User[];
    left_chat_member?: User;
    new_chat_title?: string;
    new_chat_photo?: PhotoSize[];
    delete_chat_photo?: boolean;
    group_chat_created?: boolean;
    supergroup_chat_created?: boolean;
    channel_chat_created?: boolean;
    message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
    migrate_to_chat_id?: number;
    migrate_from_chat_id?: number;
    pinned_message?: Message;
    invoice?: Invoice;
    successful_payment?: SuccessfulPayment;
    user_shared?: UserShared;
    chat_shared?: ChatShared;
    connected_website?: string;
    write_access_allowed?: WriteAccessAllowed;
    passport_data?: PassportData;
    proximity_alert_triggered?: ProximityAlertTriggered;
    forum_topic_created?: ForumTopicCreated;
    forum_topic_edited?: ForumTopicEdited;
    forum_topic_closed?: ForumTopicClosed;
    forum_topic_reopened?: ForumTopicReopened;
    general_forum_topic_hidden?: GeneralForumTopicHidden;
    general_forum_topic_unhidden?: GeneralForumTopicUnhidden;
    video_chat_scheduled?: VideoChatScheduled;
    video_chat_started?: VideoChatStarted;
    video_chat_ended?: VideoChatEnded;
    video_chat_participants_invited?: VideoChatParticipantsInvited;
    web_app_data?: WebAppData;
    reply_markup?: InlineKeyboardMarkup;
};
