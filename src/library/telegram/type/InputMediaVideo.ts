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

import { InputFile } from "./InputFile";
import { MessageEntity } from "./MessageEntity";

export type InputMediaVideo = {
    type: string;
    media: string;
    thumbnail?: InputFile|string;
    caption?: string;
    parse_mode?: string;
    caption_entities?: MessageEntity[];
    width?: number;
    height?: number;
    duration?: number;
    supports_streaming?: boolean;
    has_spoiler?: boolean;
};
