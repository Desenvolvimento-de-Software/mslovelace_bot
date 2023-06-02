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

import { PhotoSize } from "./PhotoSize.js";

export type Video = {
    fileId: string;
    fileUniqueId: string;
    width: number;
    height: number;
    duration: number;
    thumbnail?: PhotoSize;
    fileName?: string;
    mimeType?: string;
    fileSize?: number;
};
