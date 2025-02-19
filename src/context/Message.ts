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

import DeleteMessage from "library/telegram/resource/DeleteMessage";
import EditMessageText from "library/telegram/resource/EditMessageText";
import SendMessage from "library/telegram/resource/SendMessage";
import Command from "./Command";
import User from "./User";
import Chat from "./Chat";
import Log from "helper/Log";
import UserHelper from "helper/User";
import { Message as MessageType } from "library/telegram/type/Message";
import { MessageEntity } from "library/telegram/type/MessageEntity";
import { User as UserType } from "library/telegram/type/User";
import { Options as OptionsType } from "type/Options";

export default class Message {

    /**
     * Message ID.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @var {number}
     */
    private readonly id: number;

    /**
     * Message sender.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @var {User|undefined}
     */
    private readonly user: User|undefined;

    /**
     * Message chat.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @var {Chat|undefined}
     */
    private readonly chat: Chat|undefined;

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
    private mentions?: User[];

    /**
     * The message commands.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {string[]}
     */
    private readonly commands: Command[] = [];

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
    private readonly messageThreadId?: number;

    /**
     * Telegram message.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @var {MessageType}
     */
    private readonly message: MessageType;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param {MessageType} message
     */
    public constructor(message: MessageType) {

        this.message = message;
        this.id = this.message.message_id;

        if (this.message.chat) {
            this.chat = new Chat(this.message.chat);
        }

        if (this.chat && this.message.from) {
            this.user = new User(this.message.from, this.chat);
        }

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
     * @param  {string} options
     *
     * @return {Promise<Message>}
     */
    public async reply(content: string, options?: Record<string, any>): Promise<any> {

        const chatId = this.chat?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const sendMessage = new SendMessage();
        sendMessage
            .setReplyToMessageId(this.getId())
            .setChatId(chatId)
            .setText(content);

        if (options) {
            sendMessage.setOptions(options);
        }

        return sendMessage
            .post()
            .then((response) => response.json())
            .then((json) => this.validateJsonResponse(json))
            .then((json) => new Message(json.result))
            .catch((error) => Log.error(error));
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
            .setChatId(this.message.chat.id)
            .setMessageId(this.message.message_id)
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
            .setMessageId(this.message.message_id)
            .setChatId(this.message.chat.id);

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
        return this.id;
    }

    /**
     * Returns the message user.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @return {User|undefined}
     */
    public getUser(): User|undefined {
        return this.user;
    }

    /**
     * Returns the message chat.
     *
     * @author Marcos Leandro
     * @since  2025-02-19
     *
     * @return {Chat|undefined}
     */
    public getChat(): Chat|undefined {
        return this.chat;
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

        let text = this.message.text ?? "";
        let entities = this.getEntities();

        if (!entities.length) {
            return text;
        }

        for (let i = entities.length - 1; i >= 0; i--) {
            const entity = entities[i];
            text = this.addEntity(entity, text);
        }

        return text;
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
        return this.message.date;
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
        return this.message.animation || undefined;
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
        return this.message.audio || undefined;
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
        return this.message.document || undefined;
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
        return this.message.photo || undefined;
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
        return this.message.sticker || undefined;
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
        return this.message.video || undefined;
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
        return this.message.video_note || undefined;
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
        return this.message.voice || undefined;
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
        return this.message.caption ?? undefined;
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
        return this.message.caption_entities || undefined;
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
        return this.message.contact || undefined;
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

        if (!this.message.reply_to_message) {
            return;
        }

        this.replyToMessage = new Message(this.message.reply_to_message);
    }

    /**
     * Parses the message entities.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     */
    private parseEntities(): void {

        const entities = this.message.entities;
        if (!Array.isArray(entities)) {
            return;
        }

        this.entities = this.message.entities!;
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

        if (entity.type !== "mention" || !this.chat) {
            return Promise.resolve();
        }

        const username = this.message.text?.substring(
            ++entity.offset, entity.offset + entity.length
        );

        if (!username?.length) {
            return Promise.resolve();
        }

        const user = await UserHelper.getUserByUsername(username);
        if (!user) {
            return Promise.resolve();
        }

        const mention: UserType = {
            id: user.user_id,
            is_bot: user.is_bot,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            language_code: user.language_code,
            is_premium: user.is_premium
        };

        this.mentions!.push(
            new User(mention, this.chat)
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
        const command = this.message.text?.substring(start, end);

        if (!command?.length) {
            return;
        }

        const options: OptionsType = {
            start: start,
            end: end,
            params: this.message.text?.substring(end).trim()
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

    /**
     * Adds an entity to the message.
     *
     * @author Marcos Leandro
     * @since  2023-06-15
     *
     * @param entity
     * @param message
     *
     * @return {string}
     */
    private addEntity(entity: Record<string, any>, message: string): string {

        const entities = {
            spoiler: "<tg-spoiler>$1</tg-spoiler>",
            blockquote: "<blockquote>$1</blockquote>",
            code: "<code>$1</code>",
            strikethrough: "<s>$1</s>",
            underline: "<u>$1</u>",
            italic: "<i>$1</i>",
            bold: "<b>$1</b>",
            text_link: "<a href=\"$2\">$1</a>"
        };

        const start = entity.offset;
        const end = start + entity.length;

        const prefix = message.substring(0, start);
        const content = message.substring(start, end);
        const suffix = message.substring(end);

        let tag = entities[entity.type as keyof typeof entities];
        if (!tag) {
            return message;
        }

        tag = tag.replace("$2", entity.url || "");
        tag = tag.replace("$1", content);

        return `${prefix}${tag}${suffix}`;
    }
}
