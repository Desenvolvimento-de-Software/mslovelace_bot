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

import { User } from "./User";

export type ChatMemberTypes = ChatMemberOwner|ChatMemberAdministrator|ChatMemberMember|ChatMemberRestricted|ChatMemberLeft|ChatMemberBanned;

export type ChatMember = {
    status: string;
    user: User;
};

export type ChatMemberOwner = ChatMember & {
    status: "creator";
    is_anonymous: boolean;
    custom_title?: string;
};

export type ChatMemberAdministrator = ChatMemberOwner & {
    status: "administrator";
    can_be_edited: boolean;
    can_manage_chat: boolean;
    can_delete_messages: boolean;
    can_manage_video_chats: boolean;
    can_restrict_members: boolean;
    can_promote_members: boolean;
    can_change_info: boolean;
    can_invite_users: boolean;
    can_post_stories: boolean;
    can_edit_stories: boolean;
    can_delete_stories: boolean;
    can_post_messages?: boolean;
    can_edit_messages?: boolean;
    can_pin_messages?: boolean;
    can_manage_topics?: boolean;
};

export type ChatMemberMember = ChatMember & {
    status: "member";
    until_date?: number;
};

export type ChatMemberRestricted = ChatMemberMember & {
    status: "restricted";
    is_member: boolean;
    can_send_messages: boolean;
    can_send_audio: boolean;
    can_send_documents: boolean;
    can_send_photos: boolean;
    can_send_videos: boolean;
    can_send_video_notes: boolean;
    can_send_voice_notes: boolean;
    can_send_polls: boolean;
    can_send_other_messages: boolean;
    can_add_web_page_previews: boolean;
    can_change_info: boolean;
    can_invite_users: boolean;
    can_pin_messages: boolean;
    can_manage_topics: boolean;
};

export type ChatMemberLeft = ChatMember & {
    status: "left";
};

export type ChatMemberBanned = ChatMemberMember & {
    status: "kicked";
};
