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

import DeleteMessage from "../resource/DeleteMessage";
import SendMessage from "../resource/SendMessage";
import User from "./User";
import { Message as MessageType } from "../type/Message";
import { User as UserType } from "../type/User";
import UserHelper from "src/helper/User";

export default class Message {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @var {MessageType}
     */
    private context: MessageType;

    /**
     * The message mentions.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     */
    private mentions: User[] = [];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param {string} context
     */
    public constructor(context: MessageType) {
        this.context = context;
        this.parseEntities();
    }

    /**
     * Send a message.
     *
     * @author Marcos Leandro
     * @sicne  2023-06-02
     *
     * @param  {string} content
     * @param  {string} parseMode
     *
     * @return {Promise<Message>}
     */
    public async reply(content: string, parseMode?: string): Promise<Message> {

        if (!parseMode) {
            parseMode = "HTML";
        }

        const sendMessage = new SendMessage();
        sendMessage
            .setReplyToMessageId(this.context.messageId)
            .setChatId(this.context.chat.id)
            .setText(content)
            .setParseMode(parseMode);

        return sendMessage
            .post()
            .then((response) => response.json())
            .then((json) => new Message(json.result));
    }

    /**
     * Deletes the message.
     *
     * @author Marcos Leandro
     * @since  2023-06-03
     *
     * @return {Promise<Record<string, any>>}
     */
    public async delete(): Promise<Record<string, any>> {
        const deleteMessage = new DeleteMessage();
        deleteMessage
            .setMessageId(this.context.messageId)
            .setChatId(this.context.chat.id);

        return deleteMessage.post().then((response) => response.json());
    }

    /**
     * Returns the message text.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns
     */
    public getText(): string {
        return this.context.text || "";
    }

    /**
     * Returns the reply to message.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @returns
     */
    public getReplyToMessage(): Record<string, any>|undefined {
        return this.context.replyToMessage;
    }

    /**
     * Returns the message mentions.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {User[]}
     */
    public getMentions(): User[] {
        return this.mentions;
    }

    /**
     * Parses the message entities.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {void}
     */
    private parseEntities(): void {

        const entities = this.context.entities;
        if (!Array.isArray(entities)) {
            return;
        }

        for (const entity of entities) {
            this.appendMention(entity);
        }
    }

    /**
     * Appends a mention to the mentions list.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param entity
     *
     * @returns {void}
     */
    private async appendMention(entity: Record<string, any>): Promise<void> {

        if (entity.type !== "mention") {
            return;
        }

        const username = this.context.text?.substring(
            ++entity.offset, entity.offset + entity.length
        );

        if (!username) {
            return;
        }

        const user = await UserHelper.getUserByUsername(username);
        if (!user) {
            return;
        }

        const mention: UserType = {
            id: user.getId(),
            isBot: user.is_bot,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            languageCode: user.language_code,
            isPremium: user.is_premium
        };

        this.mentions.push(
            new User(mention, this.context.chat)
        );
    }
}
