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
import { Contact } from "./Contact";
import { Dice } from "./Dice";
import { Document } from "./Document";
import { Game } from "./Game";
import { Giveaway } from "./Giveaway";
import { GiveawayWinners } from "./GiveawayWinners";
import { Invoice } from "./Invoice";
import { LinkPreviewOptions } from "./LinkPreviewOptions";
import { MessageOriginUser, MessageOriginHiddenUser, MessageOriginChat, MessageOriginChannel } from "./MessageOrigin";
import { PaidMediaInfo } from "./PaidMediaInfo";
import { PhotoSize } from "./PhotoSize";
import { Poll } from "./Poll";
import { Sticker } from "./Sticker";
import { Story } from "./Story";
import { Venue } from "./Venue";
import { Video } from "./Video";
import { VideoNote } from "./VideoNote";
import { Voice } from "./Voice";

export type ExternalReplyInfo = {
    origin: MessageOriginUser|MessageOriginHiddenUser|MessageOriginChat|MessageOriginChannel;
    chat?: Chat;
    message_id?: number;
    link_preview_options?: LinkPreviewOptions;
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
    has_media_spoiler?: true;
    contact?: Contact;
    dice?: Dice;
    game?: Game;
    giveaway?: Giveaway;
    giveaway_winners?: GiveawayWinners;
    invoice?: Invoice;
    location?: Location;
    poll?: Poll;
    venue?: Venue;
};
