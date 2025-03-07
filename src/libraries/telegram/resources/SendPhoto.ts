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

import TelegramBotApi from "../TelegramBotApi";
import { InlineKeyboardMarkup } from "../types/InlineKeyboardMarkup";
import { MessageEntity } from "../types/MessageEntity";
import { ReplyParameters } from "../types/ReplyParameters";

export default class SendPhoto extends TelegramBotApi {

    /**
     * Method payload.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     */
    protected payload: Record<string, any> = {};

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     */
    public constructor() {
        super("sendPhoto");
    }

    /**
     * Sets the message options.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param options
     *
     * @return {this}
     */
    public setOptions(options: Record<string, any>): this {

        for (const key in options) {
            this.payload[key] = options[key];
        }

        return this;
    }

    /**
     * Unique identifier for the target chat or username of the target channel (in the format @channelusername).
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param  {number} chatId
     *
     * @return {this}
     */
    public setChatId(chatId: number): this {
        this.payload.chat_id = chatId;
        return this;
    }

    /**
     * Unique identifier for the target message thread (topic) of the forum; for forum supergroups only.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param threadId
     *
     * @return {this}
     */
    public setThreadId(threadId: number): this {
        this.payload.message_thread_id = threadId;
        return this;
    }

    /**
     * Photo to send.
     * Upload a new photo using multipart/form-data.
     * The photo must be at most 10 MB in size.
     * The photo's width and height must not exceed 10000 in total.
     * Width and height ratio must be at most 20.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param photo
     *
     * @return {this}
     */
    public setPhoto(photo: Blob): this {
        this.payload.photo = photo;
        return this;
    }

    /**
     * Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param caption
     *
     * @return {this}
     */
    public setCaption(caption: string): this {
        this.payload.caption = caption;
        return this;
    }

    /**
     * Mode for parsing entities in the photo caption.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param  {String} parseMode
     *
     * @return {this}
     */
    public setParseMode(parseMode: string): this {
        this.payload.parse_mode = parseMode;
        return this;
    }

    /**
     * A list of special entities that appear in the caption, which can be specified instead of parse_mode.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param captionEntities
     *
     * @return {this}
     */
    public setCaptionEntities(captionEntities: Array<MessageEntity>): this {
        this.payload.caption_entities = JSON.stringify(captionEntities);
        return this;
    }

    /**
     * Pass True, if the caption must be shown above the message media.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param showCaptionAboveMedia
     *
     * @return {this}
     */
    public setShowCaptionAboveMedia(showCaptionAboveMedia: boolean): this {
        this.payload.show_caption_above_media = showCaptionAboveMedia;
        return this;
    }

    /**
     * Pass True if the photo needs to be covered with a spoiler animation.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param hasSpoiler
     *
     * @return {this}
     */
    public setHasSpoiler(hasSpoiler: boolean): this {
        this.payload.has_spoiler = hasSpoiler;
        return this;
    }

    /**
     * Sends the message silently. Users will receive a notification with no sound.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param disableNotification
     *
     * @return {this}
     */
    public setDisableNotification(disableNotification: boolean): this {
        this.payload.disable_notification = disableNotification;
        return this;
    }

    /**
     * 	Protects the contents of the sent message from forwarding and saving.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param protectContent
     *
     * @return {this}
     */
    public setProtectContent(protectContent: boolean): this {
        this.payload.protect_content = protectContent;
        return this;
    }

    /**
     * Pass True to allow up to 1000 messages per second,
     * ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message.
     * The relevant Stars will be withdrawn from the bot's balance
     *
     * @param allowPaidBroadcast
     *
     * @return {this}
     */
    public setAllowPaidBroadcast(allowPaidBroadcast: boolean): this {
        this.payload.allow_paid_broadcast = allowPaidBroadcast;
        return this;
    }

    /**
     * Unique identifier of the message effect to be added to the message; for private chats only.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param messageEffectId
     *
     * @return {this}
     */
    public setMessageEffectId(messageEffectId: string): this {
        this.payload.message_effect_id = messageEffectId;
        return this;
    }

    /**
     * Description of the message to reply to.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param replyMarkup
     *
     * @return {this}
     */
    public setReplyParameters(replyParameters: Array<ReplyParameters>): Record<string, any> {
        this.payload.reply_parameters = replyParameters;
        return this.payload;
    }

    /**
     * Sets the reply markup.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @param  {InlineKeyboardMarkup} replyMarkup
     *
     * @return {this}
     */
    public setReplyMarkup(replyMarkup: InlineKeyboardMarkup): this {
        this.payload.replyMarkup = replyMarkup;
        return this;
    }

    /**
     * Sends the photo.
     *
     * @author Marcos Leandro
     * @since  2025-02-12
     *
     * @returns {Promise<Response>}
     */
    public async post(): Promise<Response> {

        const formData = new FormData();
        for (const key in this.payload) {
            formData.append(key, this.payload[key]);
        }

        const url = `${this.endpoint}/bot${TelegramBotApi.token}/${this.method}`;
        return fetch(url, { method: "POST", body: formData });
    }
}
