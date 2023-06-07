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
import Command from "./Command";
import User from "./User";
import { Message as MessageType } from "../type/Message";
import { User as UserType } from "../type/User";
import { Options as OptionsType } from "../../../type/Options";
import UserHelper from "../../../helper/User";

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
     * Returns the message user.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns {User}
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
     * @returns {Message|undefined}
     */
    public getReplyToMessage(): Message|undefined {
        return this.replyToMessage;
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
     * Returns the message commands.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns
     */
    public getCommands(): Command[] {
        return this.commands;
    }

    /**
     * Parses the reply to message.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns
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
     * @returns {User}
     */
    private parseSender(): User {
        return new User(this.context.from!, this.context.chat);
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
            this.appendEntity(entity);
        }
    }

    /**
     * Appends the entity.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param entity
     */
    private appendEntity(entity: Record<string, any>): void {

        switch (entity.type) {
            case "mention":
                this.appendMention(entity);
                break;

            case "bot_command":
                this.appendBotCommand(entity);
                break;
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

        console.log(user);
        const mention: UserType = {
            id: user.id,
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
}
