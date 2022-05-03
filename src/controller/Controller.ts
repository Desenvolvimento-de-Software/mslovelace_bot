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

import express from "express";
import App from "../App.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";
import Messages from "../model/Messages.js";
import TelegramBotApi from "../library/telegram/TelegramBotApi.js";
import DeleteMessage from "../library/telegram/resource/DeleteMessage.js";
import SendMessage from "../library/telegram/resource/SendMessage.js";
import GetChatAdministrators from "../library/telegram/resource/GetChatAdministrators.js";
import Lang from "../helper/Lang.js";

export default class DefaultController {

    /**
     * App instance.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected app: App;

    /**
     * Controller main path.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {string}
     */
    protected path: string;

    /**
     * Controller routes.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {express.Router}
     */
    protected router = express.Router();

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} path
     */
    public constructor(app: App, path?: string) {
        this.app  = app;
        this.path = path || "/";
        this.initializeRoutes();
        TelegramBotApi.setToken(process.env.TELEGRAM_BOT_TOKEN || "");
    }

    /**
     * Controller's main route.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public index(request: Record<string, any>, response: Record<string, any>): void {
        response.sendStatus(403);
    }

    /**
     * Returns the controller's routes.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @returns {express.Router}
     */
    public getRoutes(): express.Router {
        return this.router;
    }

    /**
     * Returns the user's Telegram ID.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} username
     *
     * @returns {Promise<number|null>}
     */
    protected async getUserId(payload: Record<string, any>): Promise<number|null> {

        if (typeof payload.message?.reply_to_message?.from?.id !== "undefined") {
            return payload.message.reply_to_message.from.id;
        }

        const message = payload.message.text || "";
        const content = message.split(" ");

        if (content.length < 2) {
            return null;
        }

        if (payload.message?.entities?.length) {
            for (let i = 0, length = payload.message?.entities?.length; i < length; i++) {

                if (payload.message.entities[i].type === "mention") {
                    return await this.getUserByMention(
                        content[1].replace(/^@/, "")
                    );
                }
            }
        }

        if (Number(content[1]) == content[1]) {
            return Number(content[1]);
        }

        return null;
    }

    /**
     * Returns the user's Telegram ID by its username.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {string} username
     *
     * @returns {Promise<number|null>}
     */
    protected async getUserByMention(username: string): Promise<number|null> {

        const user = await UserHelper.getUserByUsername(username);

        if (user) {
            return user.user_id;
        }

        return null;
    }

    /**
     * Saves the user and group.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
    protected async saveUserAndChat(userObject: Record<string, any>, chatObject: Record<string, any>): Promise<any> {

        const user   = await UserHelper.getUserByTelegramId(userObject.id);
        const userId = user === null ? await UserHelper.createUser(userObject) : user.id;

        const chat   = await ChatHelper.getChatByTelegramId(chatObject.id);
        const chatId = chat === null ? await ChatHelper.createChat(chatObject) : chat.id;

        UserHelper.updateUser(userObject);
        ChatHelper.updateChat(chatObject);

        if (user && chat) {
            this.warnNamechanging(user, userObject, chat);
        }

        if (userId && chatId) {

            const relUserChat = new RelUsersChats();

            relUserChat
                .replace()
                .set("user_id", userId)
                .set("chat_id", chatId)
                .set("date", Math.floor(Date.now() / 1000));

            relUserChat.execute();
        }
    }

    /**
     * Saves the message.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
    protected async saveMessage(payload: Record<string, any>): Promise<any> {

        const user = await UserHelper.getUserByTelegramId(payload.message.from.id);
        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);

        if (!user || !chat) {
            return;
        }

        let replyTo = null;

        if (payload.message.reply_to_message) {

            const messages = new Messages();
            messages
                .select()
                .where("chat_id").equal(chat.id)
                .and("message_id").equal(payload.message.reply_to_message.message_id);

            const originalMessage = await messages.execute();
            if (originalMessage.length) {
                replyTo = originalMessage[0].id;
            }
        }

        const message = new Messages();
        message
            .insert()
            .set("user_id", user.id)
            .set("chat_id", chat.id)
            .set("reply_to", replyTo)
            .set("message_id", payload.message.message_id)
            .set("content", payload.message?.text || null)
            .set("date", payload.message.date);

        message.execute();
    }

    /**
     * Warns if the users has changed their name.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param user
     * @param payload
     */
    protected async warnNamechanging(user: Record<string, any>, userObject: Record<string, any>, chat: Record<string, any>): Promise<void> {

        if (!chat.warn_name_changing) {
            return;
        }

        const firstName = userObject.first_name || null;
        const lastName  = userObject.last_name || null;

        if (user.first_name === firstName && user.last_name === lastName) {
            return;
        }

        Lang.set(chat.language);

        let oldName;
        if (userObject.first_name.length) {
            oldName = user.first_name;
        }

        if (user.last_name.length) {
            oldName += (oldName.length ? " " : "") + user.last_name;
        }

        let newName;
        if (typeof userObject.first_name !== "undefined") {
            newName = userObject.first_name;
        }

        if (typeof userObject.last_name !== "undefined") {
            newName += (newName.length ? " " : "") + userObject.last_name;
        }

        const text = Lang.get("warnNameChanging")
            .replaceAll("{userid}", userObject.id)
            .replaceAll("{oldname}", oldName)
            .replaceAll("{newname}", newName);

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(chat.chat_id)
            .setText(text)
            .setParseMode("HTML")
            .post();
    }

    /**
     * Deletes a message.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected async deleteMessage(messageId: number, chatId: number): Promise<void> {

        const deleteMessage = new DeleteMessage();
        deleteMessage
            .setMessageId(messageId)
            .setChatId(chatId)
            .post();
    }

    /**
     * Verifies if the user is one of the chat admins.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number}  chatId
     * @param  {boolean} report
     *
     * @return {boolean}
     */
     protected async isAdmin(payload: Record<string, any>): Promise<any> {

        if (payload.message.chat.type === "private") {
            return true;
        }

        const request = new GetChatAdministrators();
        request.setChatId(payload.message.chat.id);

        const response = await request.post();
        const json     = await response.json();

        if (!json.hasOwnProperty("ok") || json.ok !== true) {
            return false;
        }

        let admins: Array<any> = [];
        for (let i = 0, length = json.result.length; i < length; i++) {
            admins.push(json.result[i].user.id);
        }

        return admins.includes(payload.message.from.id);
    }

    /**
     * Initializes the controller's routes.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected initializeRoutes(): void {
        this.router.all(this.path, this.index.bind(this));
    }
}
