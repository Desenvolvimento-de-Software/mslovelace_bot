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

import Action from "./Action";
import ChatHelper from "helper/Chat";
import Context from "context/Context";
import Log from "helper/Log";
import Messages from "model/Messages";
import UserHelper from "helper/User";
import CallbackQuery from "context/CallbackQuery";
import Builder from "model/mysql/Builder";
import { AdditionalData as AdditionalDataType } from "type/AdditionalData";
import { Message as MessageType } from "model/type/Message";

type AdditionalData = Record<string, string | number | boolean>;

export default class SaveMessage extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context, "sync");
    }

    /**
     * Runs the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param additionalData
     */
    public async run(additionalData?: AdditionalDataType): Promise<void> {

        if (!this.context.getMessage()?.getId()) {
            return Promise.resolve();
        }

        const contextUser = this.context.getNewChatMember() || this.context.getLeftChatMember() || this.context.getUser();
        if (!contextUser) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(contextUser.getId());
        const userId = user?.id ?? await UserHelper.createUser(contextUser);

        const telegramChat = this.context.getChat();
        if (!telegramChat) {
            Log.save("SaveMessage :: Chat not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(telegramChat.getId());
        const chatId = chat?.id ?? await ChatHelper.createChat(telegramChat);

        if (!user || !userId) {
            Log.save("SaveMessage :: User ID not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        if (!chat || !chatId) {
            Log.save("SaveMessage :: Chat ID not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        const messageExists = await this.messageExists();
        if (messageExists || this.context.getType() === "edited_message") {
            this.updateMessage(user, chat, additionalData);
            return Promise.resolve();
        }

        this.saveNewMessage(user, chat, additionalData);
        return Promise.resolve();
    }

    /**
     * Returns whether the message exists.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @return {Promise<boolean>}
     */
    private async messageExists(): Promise<boolean> {

        const messageId = this.context.getMessage()?.getId();
        const chatId = this.context.getChat()?.getId();

        if (!chatId || !messageId) {
            return Promise.resolve(false);
        }

        const messageModel = new Messages();
        messageModel
            .select()
            .where("chat_id").equal(chatId)
            .and("message_id").equal(messageId)
            .offset(0)
            .limit(1);

        const message = await messageModel.execute<MessageType[]>();
        return !!message.length;
    }

    /**
     * Saves the new message.
     *
     * @author Marcos Leandro
     * @since  2023-06-16
     *
     * @param user
     * @param chat
     *
     * @return Promise<void>
     */
    private async saveNewMessage(
        user: Record<string, any>,
        chat: Record<string, any>,
        additionalData?: AdditionalDataType
    ): Promise<void> {

        const message = this.context.getMessage();
        if (!message) {
            return Promise.resolve();
        }

        const messageModel = new Messages();
        const insert = messageModel.insert();

        insert
            .set("type", this.context.getType())
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("message_id", message.getId())
            .set("content", message.getText())
            .set("date", message.getDate() ?? Math.floor(Date.now() / 1000));

        await this.addQueryParams(insert, additionalData);

        messageModel.execute();
        return Promise.resolve();
    }

    /**
     * Updates a message.
     *
     * @author Marcos Leandro
     * @since  2023-06-16
     *
     * @param user
     * @param chat
     * @param additionalData
     *
     * @return {Promise<void>}
     */
    private async updateMessage(
        user: Record<string, any>,
        chat: Record<string, any>,
        additionalData?: AdditionalDataType
    ): Promise<void> {

        const message = this.context.getMessage();
        if (!message) {
            return Promise.resolve();
        }

        const messageModel = new Messages();
        const update = messageModel.update();
        update
            .set("type", this.context.getType())
            .set("content", message.getText())
            .set("date", message.getDate() ?? Math.floor(Date.now() / 1000))
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .and("message_id").equal(message.getId());

        await this.addQueryParams(update, additionalData);

        messageModel.execute();
        return Promise.resolve();
    }

    /**
     * Adds the query parameters.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param operation
     * @param additionalData
     *
     * @return {Promise<Builder>}
     */
    private async addQueryParams(operation: Builder, additionalData?: AdditionalDataType): Promise<Builder> {

        const message = this.context.getMessage();
        if (!message) {
            return Promise.resolve(operation);
        }

        const threadId = message.getMessageThreadId();
        threadId && (operation.set("thread_id", threadId));

        const replyTo = await this.getReplyMessageId();
        replyTo && (operation.set("reply_to", replyTo));

        const callbackData = this.context instanceof CallbackQuery ? this.context?.getData() : null;
        callbackData && (operation.set("callbackQuery", JSON.stringify(callbackData)));

        const entities = message.getEntities();
        entities && (operation.set("entities", JSON.stringify(entities)));

        const animation = message.getAnimation();
        animation && (operation.set("animation", JSON.stringify(animation)));

        const audio = message.getAudio();
        audio && (operation.set("audio", JSON.stringify(audio)));

        const document = message.getDocument();
        document && (operation.set("document", JSON.stringify(document)));

        const photo = message.getPhoto();
        photo && (operation.set("photo", JSON.stringify(photo)));

        const sticker = message.getSticker();
        sticker && (operation.set("sticker", JSON.stringify(sticker)));

        const video = message.getVideo();
        video && (operation.set("video", JSON.stringify(video)));

        const videoNote = message.getVideoNote();
        videoNote && (operation.set("videoNote", JSON.stringify(videoNote)));

        const voice = message.getVoice();
        voice && (operation.set("voice", JSON.stringify(voice)));

        const caption = message.getCaption();
        caption && (operation.set("caption", caption));

        const captionEntities = message.getCaptionEntities();
        captionEntities && (operation.set("captionEntities", JSON.stringify(captionEntities)));

        const contact = message.getContact();
        contact && (operation.set("contact", JSON.stringify(contact)));

        if (additionalData) {
            Object.keys(additionalData).forEach((key) => {
                operation.set(key, additionalData[key]);
            });
        }

        return Promise.resolve(operation);
    }

    /**
     * Returns the message id of the reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-16
     *
     * @param replyTo
     *
     * @return {number|null}
     */
    private async getReplyMessageId(): Promise<number|null> {

        const message = this.context.getMessage();
        if (!message) {
            return Promise.resolve(null);
        }

        const replyToMessage = message.getReplyToMessage();
        if (!replyToMessage) {
            return null;
        }

        const messageModel = new Messages();
        messageModel
            .select()
            .where("message_id").equal(replyToMessage.getId());

        const reply = await messageModel.execute<MessageType[]>();
        if (reply.length) {
            return reply[0].id;
        }

        return null;
    }
}
