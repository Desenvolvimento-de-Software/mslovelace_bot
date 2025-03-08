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
import Context from "contexts/Context";
import Log from "helpers/Log";
import CallbackQuery from "contexts/CallbackQuery";
import { getUserAndChatByTelegramId } from "services/UsersAndChats";
import { AdditionalData as AdditionalDataType } from "types/AdditionalData";
import { PrismaClient, messages_type } from "@prisma/client";

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
        if (!contextUser || !this.context.getChat()?.getId()) {
            Log.save("SaveMessage :: User or Chat not found " + JSON.stringify(this.context.getPayload()));
            return Promise.resolve();
        }

        const userAndChat = await getUserAndChatByTelegramId(contextUser.getId(), this.context.getChat()!.getId());
        const data = {
            user_id: userAndChat!.users.id,
            chat_id: userAndChat!.chats.id,
            message_id: this.context.getMessage()!.getId(),
            type: this.context.getType() as messages_type,
            content: this.context.getMessage()!.getText(),
            date: this.context.getMessage()!.getDate() ?? Math.floor(Date.now() / 1000)
        };

        await this.addQueryParams(data, additionalData);

        const prisma = new PrismaClient();
        await prisma.messages.create({
            data: data

        }).catch((err) => {
            Log.save(err.message, err.trace);

        }).finally(async () => {
            await prisma.$disconnect();
        });
    }

    /**
     * Adds the query parameters.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param data
     * @param additionalData
     *
     * @return {Promise<Builder>}
     */
    private async addQueryParams(data: Record<string, any>, additionalData?: AdditionalDataType): Promise<void> {

        const message = this.context.getMessage();
        if (!message) {
            return Promise.resolve();
        }

        const threadId = message.getMessageThreadId();
        threadId && (data["thread_id"] = threadId);

        const replyTo = await this.getReplyMessageId();
        replyTo && (data["reply_to"] = replyTo);

        const callbackData = this.context instanceof CallbackQuery ? this.context?.getData() : null;
        callbackData && (data["callbackQuery"] = JSON.stringify(callbackData));

        const entities = message.getEntities();
        entities && (data["entities"] = JSON.stringify(entities));

        const animation = message.getAnimation();
        animation && (data["animation"] = JSON.stringify(animation));

        const audio = message.getAudio();
        audio && (data["audio"] = JSON.stringify(audio));

        const document = message.getDocument();
        document && (data["document"] = JSON.stringify(document));

        const photo = message.getPhoto();
        photo && (data["photo"] = JSON.stringify(photo));

        const sticker = message.getSticker();
        sticker && (data["sticker"] = JSON.stringify(sticker));

        const video = message.getVideo();
        video && (data["video"] = JSON.stringify(video));

        const videoNote = message.getVideoNote();
        videoNote && (data["videoNote"] = JSON.stringify(videoNote));

        const voice = message.getVoice();
        voice && (data["voice"] = JSON.stringify(voice));

        const caption = message.getCaption();
        caption && (data["caption"] = caption);

        const captionEntities = message.getCaptionEntities();
        captionEntities && (data["captionEntities"] = JSON.stringify(captionEntities));

        const contact = message.getContact();
        contact && (data["contact"] = JSON.stringify(contact));

        if (additionalData) {
            Object.keys(additionalData).forEach((key) => {
                data[key] = additionalData[key];
            });
        }
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

        const prisma = new PrismaClient();
        return await prisma.messages.findFirst({
            where: {
                message_id: replyToMessage.getId()
            }
        }).then((reply) => {
            return reply?.id ?? null;

        }).catch((err) => {
            Log.save(err.message, err.trace);
            return null;

        }).finally(async () => {
            await prisma.$disconnect();
        });
    }
}
