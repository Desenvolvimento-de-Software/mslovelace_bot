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

import DeleteMessage from "../resource/DeleteMessage.js";
import EditMessageText from "../resource/EditMessageText.js";
import SendMessage from "../resource/SendMessage.js";
import Command from "./Command.js";
import User from "./User.js";
import Chat from "./Chat.js";
import { Message as MessageType } from "../type/Message.js";
import { User as UserType } from "../type/User.js";
import { Options as OptionsType } from "../../../type/Options.js";
import UserHelper from "../../../helper/User.js";
import { MessageEntity } from "../type/MessageEntity.js";

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
     * Message sender.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @var {User}
     */
    private user: User;

    /**
     * Message entities.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     *
     * @var {Record<string, any>[]}
     */
    private entities: MessageEntity[] = [];

    /**
     * The message mentions.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @var {User[]}
     */
    private mentions: User[] = [];

    /**
     * The message commands.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {string[]}
     */
    private commands: Command[] = [];

    /**
     * Reply to message context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    private replyToMessage?: Message;

    /**
     * Message thread ID.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    private messageThreadId?: number;

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
        this.user = this.parseSender();
        this.parseEntities();
        this.parseCommands();
        this.parseReplyToMessage();
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
    public async reply(content: string, options?: Record<string, any>): Promise<any> {

        const sendMessage = new SendMessage();
        sendMessage
            .setReplyToMessageId(this.context.messageId)
            .setChatId(this.context.chat.id)
            .setText(content);

        if (options) {
            sendMessage.setOptions(options);
        }

        return sendMessage
            .post()
            .then((response) => response.json())
            .then((json) => this.validateJsonResponse(json))
            .then((json) => new Message(json.result))
            .catch((error) => console.error(error));
    }

    /**
     * Edit the message.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param  {string} content
     * @param  {Record<string, any>} options
     *
     * @return {Promise<Message>}
     */
    public async edit(content: string, options?: Record<string, any>): Promise<any> {

        const editMessage = new EditMessageText();
        editMessage
            .setChatId(this.context.chat.id)
            .setMessageId(this.context.messageId)
            .setText(content);

        if (options) {
            editMessage.setOptions(options);
        }

        return editMessage
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
     * Parses the message ID.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @return {number}
     */
    public getId(): number {
        return this.context.messageId;
    }

    /**
     * Returns the message user.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @return {User}
     */
    public getUser(): User {
        return this.user;
    }

    /**
     * Returns the message text.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @return {string}
     */
    public getText(): string {
        return this.context.text || "";
    }

    /**
     * Returns the message date.
     *
     * @author Marcos Leandro
     * @since  2023-06-16
     *
     * @return {number|undefined}
     */
    public getDate(): number|undefined {
        return this.context.date;
    }

    /**
     * Returns the reply to message.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @return {Message|undefined}
     */
    public getReplyToMessage(): Message|undefined {
        return this.replyToMessage;
    }

    /**
     * Returns the message thread ID.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @return (number|undefined)
     */
    public getMessageThreadId(): number|undefined {
        return this.messageThreadId;
    }

    /**
     * Returns the message entities.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     *
     * @return {MessageEntity[]}
     */
    public getEntities(): MessageEntity[] {
        return this.entities;
    }

    /**
     * Returns the message mentions.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {User[]}
     */
    public async getMentions(): Promise<User[]> {

        if (typeof this.mentions === "undefined") {
            this.mentions = [];
            await this.parseMentions();
        }

        return this.mentions || [];
    }

    /**
     * Returns the message commands.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @return
     */
    public getCommands(): Command[] {
        return this.commands;
    }

    /**
     * Returns the message animation.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getAnimation(): Record<string, any>|undefined {
        return this.context.animation || undefined;
    }

    /**
     * Returns the message audio.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getAudio(): Record<string, any>|undefined {
        return this.context.audio || undefined;
    }

    /**
     * Returns the message document.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getDocument(): Record<string, any>|undefined {
        return this.context.document || undefined;
    }

    /**
     * Returns the message photo.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getPhoto(): Record<string, any>[]|undefined {
        return this.context.photo || undefined;
    }

    /**
     * Returns the message sticker.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getSticker(): Record<string, any>|undefined {
        return this.context.sticker || undefined;
    }

    /**
     * Returns the message video.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getVideo(): Record<string, any>|undefined {
        return this.context.video || undefined;
    }

    /**
     * Returns the message video note.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getVideoNote(): Record<string, any>|undefined {
        return this.context.videoNote || undefined;
    }

    /**
     * Returns the message voice.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getVoice(): Record<string, any>|undefined {
        return this.context.voice || undefined;
    }

    /**
     * Returns the message caption.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getCaption(): string|undefined {
        return this.context.caption || undefined;
    }

    /**
     * Returns the message caption entities.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getCaptionEntities(): Record<string, any>[]|undefined {
        return this.context.captionEntities || undefined;
    }

    /**
     * Returns the message contact.
     *
     * @author Marcos Leandro
     * @since  2023-06-19
     *
     * @return {Record<string, any>|undefined}
     */
    public getContact(): Record<string, any>|undefined {
        return this.context.contact || undefined;
    }

    /**
     * Parses the reply to message.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @return
     */
    private parseReplyToMessage(): void {

        if (!this.context.replyToMessage) {
            return;
        }

        this.replyToMessage = new Message(this.context.replyToMessage);
    }

    /**
     * Parses the message sender.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {User}
     */
    private parseSender(): User {
        return new User(this.context.from!, new Chat(this.context));
    }

    /**
     * Parses the message entities.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     */
    private parseEntities(): void {

        const entities = this.context.entities;
        if (!Array.isArray(entities)) {
            return;
        }

        this.entities = this.context.entities!;
    }

    /**
     * Parses the message commands.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @return {void}
     */
    private parseCommands(): void {
        for (const entity of this.entities) {
            this.parseCommand(entity);
        }
    }

    /**
     * Parses the message mentions.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     */
    private async parseMentions(): Promise<void> {
        for (const entity of this.entities) {
            await this.appendMention(entity);
        }
    }

    /**
     * Appends the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param entity
     */
    private parseCommand(entity: Record<string, any>): void {

        if (entity.type !== "bot_command") {
            return;
        }

        this.appendBotCommand(entity);
    }

    /**
     * Appends a mention to the mentions list.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @param entity
     *
     * @return {void}
     */
    private async appendMention(entity: Record<string, any>): Promise<void> {

        if (entity.type !== "mention") {
            return;
        }

        const username = this.context.text?.substring(
            ++entity.offset, entity.offset + entity.length
        );

        if (!username || !username.length) {
            return;
        }

        const user = await UserHelper.getUserByUsername(username);
        if (!user) {
            return;
        }

        const mention: UserType = {
            id: user.user_id,
            isBot: user.is_bot,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            languageCode: user.language_code,
            isPremium: user.is_premium
        };

        this.mentions!.push(
            new User(mention, new Chat(this.context))
        );
    }

    /**
     * Appends the bot command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param entity
     */
    private async appendBotCommand(entity: Record<string, any>): Promise<void> {

        const start = ++entity.offset;
        const end = start + (entity.length - 1);
        const command = this.context.text?.substring(start, end);

        if (!command || !command.length) {
            return;
        }

        const options: OptionsType = {
            start: start,
            end: end,
            params: this.context.text?.substring(end).trim()
        };

        this.commands.push(new Command(command, options));
    }

    /**
     * Validates the json response.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     *
     * @param {Record<string, any>} response
     *
     * @return {Record<string, any>}
     */
    private validateJsonResponse(response: Record<string, any>): Record<string, any> {
        if (!response.result) {
            throw new Error(JSON.stringify(response));
        }

        return response;
    }
}
