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
import { ChatBackground } from "./ChatBackground";
import { ChatBoostAdded } from "./ChatBoostAdded";
import { ChatShared } from "./ChatShared";
import { Contact } from "./Contact";
import { Dice } from "./Dice";
import { Document } from "./Document";
import { ExternalReplyInfo } from "./ExternalReplyInfo";
import { ForumTopicClosed } from "./ForumTopicClosed";
import { ForumTopicCreated } from "./ForumTopicCreated";
import { ForumTopicEdited } from "./ForumTopicEdited";
import { ForumTopicReopened } from "./ForumTopicReopened";
import { Game } from "./Game";
import { GeneralForumTopicHidden } from "./GeneralForumTopicHidden";
import { GeneralForumTopicUnhidden } from "./GeneralForumTopicUnhidden";
import { Giveaway } from "./Giveaway";
import { GiveawayCompleted } from "./GiveawayCompleted";
import { GiveawayCreated } from "./GiveawayCreated";
import { GiveawayWinners } from "./GiveawayWinners";
import { InlineKeyboardMarkup } from "./InlineKeyboardMarkup";
import { Invoice } from "./Invoice";
import { LinkPreviewOptions } from "./LinkPreviewOptions";
import { Location } from "./Location";
import { MessageAutoDeleteTimerChanged } from "./MessageAutoDeleteTimerChanged";
import { MessageEntity } from "./MessageEntity";
import { MessageOriginUser, MessageOriginHiddenUser, MessageOriginChat, MessageOriginChannel } from "./MessageOrigin";
import { PassportData } from "./PassportData";
import { PaidMediaInfo } from "./PaidMediaInfo";
import { PhotoSize } from "./PhotoSize";
import { Poll } from "./Poll";
import { ProximityAlertTriggered } from "./ProximityAlertTriggered";
import { RefundedPayment } from "./RefundedPayment";
import { Sticker } from "./Sticker";
import { Story } from "./Story";
import { SuccessfulPayment } from "./SuccessfulPayment";
import { TextQuote } from "./TextQuote";
import { User } from "./User";
import { UsersShared } from "./UsersShared";
import { Venue } from "./Venue";
import { Video } from "./Video";
import { VideoChatEnded } from "./VideoChatEnded";
import { VideoChatParticipantsInvited } from "./VideoChatParticipantsInvited";
import { VideoChatScheduled } from "./VideoChatScheduled";
import { VideoChatStarted } from "./VideoChatStarted";
import { VideoNote } from "./VideoNote";
import { Voice } from "./Voice";
import { WebAppData } from "./WebAppData";
import { WriteAccessAllowed } from "./WriteAccessAllowed";

export type Message = {
    message_id: number;
    message_thread_id?: number;
    from?: User;
    sender_chat?: Chat;
    sender_boost_count?: number;
    sender_business_bot?: User;
    date: number;
    business_connection_id?: string;
    chat: Chat;
    forward_origin?: MessageOriginUser|MessageOriginHiddenUser|MessageOriginChat|MessageOriginChannel;
    is_topic_message?: true;
    is_automatic_forward?: true;
    reply_to_message?: Message;
    external_reply?: ExternalReplyInfo;
    quote?: TextQuote;
    reply_to_story?: Story;
    via_bot?: User;
    edit_date?: number;
    has_protected_content?: true;
    is_from_offline?: true;
    media_group_id?: string;
    author_signature?: string;
    text?: string;
    entities?: MessageEntity[];
    link_preview_options?: LinkPreviewOptions;
    effect_id?: string;
    animation?: Animation;
    audio?: Audio;
    document?: Document;
    paid_media?: PaidMediaInfo;
    photo?: PhotoSize[];
    sticker?: Sticker;
    story?: Story;
    video?: Video;
    video_note?: VideoNote;
    voice?: Voice;
    caption?: string;
    caption_entities?: MessageEntity[];
    show_caption_above_media?: true;
    has_media_spoiler?: true;
    contact?: Contact;
    dice?: Dice;
    game?: Game;
    poll?: Poll;
    venue?: Venue;
    location?: Location;
    new_chat_members?: User[];
    left_chat_member?: User;
    new_chat_title?: string;
    new_chat_photo?: PhotoSize[];
    delete_chat_photo?: true;
    group_chat_created?: true;
    supergroup_chat_created?: true;
    channel_chat_created?: true;
    message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged;
    migrate_to_chat_id?: number;
    migrate_from_chat_id?: number;
    pinned_message?: Message|InaccessibleMessage;
    invoice?: Invoice;
    successful_payment?: SuccessfulPayment;
    refunded_payment?: RefundedPayment;
    users_shared?: UsersShared;
    chat_shared?: ChatShared;
    connected_website?: string;
    write_access_allowed?: WriteAccessAllowed;
    passport_data?: PassportData;
    proximity_alert_triggered?: ProximityAlertTriggered;
    boost_added?: ChatBoostAdded;
    chat_background_set?: ChatBackground
    forum_topic_created?: ForumTopicCreated
    forum_topic_edited?: ForumTopicEdited
    forum_topic_closed?: ForumTopicClosed
    forum_topic_reopened?: ForumTopicReopened
    general_forum_topic_hidden?: GeneralForumTopicHidden
    general_forum_topic_unhidden?: GeneralForumTopicUnhidden
    giveaway_created?: GiveawayCreated
    giveaway?: Giveaway
    giveaway_winners?: GiveawayWinners
    giveaway_completed?: GiveawayCompleted
    video_chat_scheduled?: VideoChatScheduled
    video_chat_started?: VideoChatStarted
    video_chat_ended?: VideoChatEnded
    video_chat_participants_invited?: VideoChatParticipantsInvited
    web_app_data?: WebAppData
    reply_markup?: InlineKeyboardMarkup
};

export type InaccessibleMessage = {
    chat: Chat;
    message_id: number;
    date: 0;
};
