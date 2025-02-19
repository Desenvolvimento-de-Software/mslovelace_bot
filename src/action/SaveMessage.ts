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
     */
    public async run(): Promise<void> {

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

        switch (this.context.getType()) {

            case "editedMessage":
                this.updateMessage(user, chat);
                break;

            default:
                this.saveNewMessage(user, chat);
        }

        return Promise.resolve();
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
    private async saveNewMessage(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

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
            .set("date", message.getDate() || Math.floor(Date.now() / 1000));

        const threadId = message.getMessageThreadId();
        if (threadId) {
            insert.set("thread_id", threadId);
        }

        const replyTo = await this.getReplyMessageId();
        if (replyTo) {
            insert.set("reply_to", replyTo);
        }

        const callbackData = this.context.getCallbackQuery()?.callbackData;
        if (callbackData) {
            insert.set("callbackQuery", JSON.stringify(callbackData));
        }

        const entities = message.getEntities();
        if (entities) {
            insert.set("entities", JSON.stringify(entities));
        }

        const animation = message.getAnimation();
        if (animation) {
            insert.set("animation", JSON.stringify(animation));
        }

        const audio = message.getAudio();
        if (audio) {
            insert.set("audio", JSON.stringify(audio));
        }

        const document = message.getDocument();
        if (document) {
            insert.set("document", JSON.stringify(document));
        }

        const photo = message.getPhoto();
        if (photo) {
            insert.set("photo", JSON.stringify(photo));
        }

        const sticker = message.getSticker();
        if (sticker) {
            insert.set("sticker", JSON.stringify(sticker));
        }

        const video = message.getVideo();
        if (video) {
            insert.set("video", JSON.stringify(video));
        }

        const videoNote = message.getVideoNote();
        if (videoNote) {
            insert.set("videoNote", JSON.stringify(videoNote));
        }

        const voice = message.getVoice();
        if (voice) {
            insert.set("voice", JSON.stringify(voice));
        }

        const caption = message.getCaption();
        if (caption) {
            insert.set("caption", caption);
        }

        const captionEntities = message.getCaptionEntities();
        if (captionEntities) {
            insert.set("captionEntities", JSON.stringify(captionEntities));
        }

        const contact = message.getContact();
        if (contact) {
            insert.set("contact", JSON.stringify(contact));
        }

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
     *
     * @return Promise<void>
     */
    private async updateMessage(user: Record<string, any>, chat: Record<string, any>): Promise<void> {

        const message = this.context.getMessage();
        if (!message) {
            return Promise.resolve();
        }

        const messageModel = new Messages();
        const update = messageModel.update();
        update
            .set("type", this.context.getType())
            .set("content", message.getText())
            .set("date", message.getDate() || Math.floor(Date.now() / 1000))
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .and("message_id").equal(message.getId());

        const threadId = message.getMessageThreadId();
        if (threadId) {
            update.set("thread_id", threadId);
        }

        const replyTo = await this.getReplyMessageId();
        if (replyTo) {
            update.set("reply_to", replyTo);
        }

        const entities = message.getEntities();
        if (entities) {
            update.set("entities", JSON.stringify(entities));
        }

        messageModel.execute();
        return Promise.resolve();
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

        const reply = await messageModel.execute();
        if (reply.length) {
            return reply[0].id;
        }

        return null;
    }
}
