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

export type ChatInviteLink = {
    inviteLink: string;
    creator: User;
    createsJoinRequest: boolean;
    isPrimary: boolean;
    isRevoked: boolean;
    name?: string;
    expireDate?: number;
    memberLimit?: number;
    pendingJoinRequestCount?: number;
};
