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

import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";
import TelegramBotApi from "../library/telegram/TelegramBotApi.js";
import DeleteMessage from "../library/telegram/resource/DeleteMessage.js";
import SendMessage from "../library/telegram/resource/SendMessage.js";
import GetChatAdministrators from "../library/telegram/resource/GetChatAdministrators.js";
import Lang from "../helper/Lang.js";
import express from "express";

export default class DefaultController {

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
    constructor(path?: string) {
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
                .set("chat_id", chatId);

            relUserChat.execute();
        }
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

        const text = Lang.get("warnNameChanging")
            .replaceAll("{userid}", userObject.id)
            .replaceAll("{oldname}", user.first_name + " " + user.last_name)
            .replaceAll("{newname}", userObject.first_name + " " + userObject.last_name);

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
