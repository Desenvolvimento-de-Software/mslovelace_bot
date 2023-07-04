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

import Action from "./Action.js";
import Context from "../library/telegram/context/Context.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import Messages from "../model/Messages.js";

export default class saveUserAndChat extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context, "async");
    }

    /**
     * Runs the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     */
    public async run(): Promise<void> {

        if (!this.context.message) {
            return;
        }

        const contextUser = this.context.newChatMember || this.context.leftChatMember || this.context.user;
        const user = await UserHelper.getByTelegramId(contextUser.getId());
        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        switch (this.context.type) {

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

        const message = new Messages();
        const insert = message.insert();
        insert
            .set("type", this.context.type)
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("message_id", this.context.message.getId())
            .set("content", this.context.message.getText())
            .set("date", this.context.message.getDate() || Math.floor(Date.now() / 1000));

        const threadId = this.context.message.getMessageThreadId();
        if (threadId) {
            insert.set("thread_id", threadId);
        }

        const replyTo = await this.getReplyMessageId();
        if (replyTo) {
            insert.set("reply_to", replyTo);
        }

        const callbackData = this.context.callbackQuery?.callbackData;
        if (callbackData) {
            insert.set("callbackQuery", JSON.stringify(callbackData));
        }

        const entities = this.context.message.getEntities();
        if (entities) {
            insert.set("entities", JSON.stringify(entities));
        }

        const animation = this.context.message.getAnimation();
        if (animation) {
            insert.set("animation", JSON.stringify(animation));
        }

        const audio = this.context.message.getAudio();
        if (audio) {
            insert.set("audio", JSON.stringify(audio));
        }

        const document = this.context.message.getDocument();
        if (document) {
            insert.set("document", JSON.stringify(document));
        }

        const photo = this.context.message.getPhoto();
        if (photo) {
            insert.set("photo", JSON.stringify(photo));
        }

        const sticker = this.context.message.getSticker();
        if (sticker) {
            insert.set("sticker", JSON.stringify(sticker));
        }

        const video = this.context.message.getVideo();
        if (video) {
            insert.set("video", JSON.stringify(video));
        }

        const videoNote = this.context.message.getVideoNote();
        if (videoNote) {
            insert.set("videoNote", JSON.stringify(videoNote));
        }

        const voice = this.context.message.getVoice();
        if (voice) {
            insert.set("voice", JSON.stringify(voice));
        }

        const caption = this.context.message.getCaption();
        if (caption) {
            insert.set("caption", caption);
        }

        const captionEntities = this.context.message.getCaptionEntities();
        if (captionEntities) {
            insert.set("captionEntities", JSON.stringify(captionEntities));
        }

        const contact = this.context.message.getContact();
        if (contact) {
            insert.set("contact", JSON.stringify(contact));
        }

        message.execute();
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

        const message = new Messages();
        const update = message.update();
        update
            .set("type", this.context.type)
            .set("content", this.context.message.getText())
            .set("date", this.context.message.getDate() || Math.floor(Date.now() / 1000))
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .and("message_id").equal(this.context.message.getId());

        const threadId = this.context.message.getMessageThreadId();
        if (threadId) {
            update.set("thread_id", threadId);
        }

        const replyTo = await this.getReplyMessageId();
        if (replyTo) {
            update.set("reply_to", replyTo);
        }

        const entities = this.context.message.getEntities();
        if (entities) {
            update.set("entities", JSON.stringify(entities));
        }

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

        const replyToMessage = this.context.message.getReplyToMessage();
        if (!replyToMessage) {
            return null;
        }

        const message = new Messages();
        message
            .select()
            .where("message_id").equal(replyToMessage.getId());

        const reply = await message.execute();
        if (reply.length) {
            return reply[0].id;
        }

        return null;
    }
}
