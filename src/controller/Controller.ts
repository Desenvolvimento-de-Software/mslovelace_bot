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

import App from "../App.js";
import UserHelper from "../helper/User.js";
import ChatHelper from "../helper/Chat.js";
import RelUsersChats from "../model/RelUsersChats.js";
import TelegramBotApi from "../library/telegram/TelegramBotApi.js";
import express from "express";

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
    constructor(app: App, path?: string) {
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
     * Saves the user and group.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
    protected async saveUserAndChat(userObject: Record<string, any>, chatObject: Record<string, any>): Promise<any> {

        const user = await UserHelper.getUserByTelegramId(userObject.id);
        const userId = user === null ? await UserHelper.createUser(userObject) : user.id;

        if (user) {
            this.warnNamechanging(user, userObject);
        }

        const chat   = await ChatHelper.getChatByTelegramId(chatObject.id);
        const chatId = chat === null ? await ChatHelper.createChat(chatObject) : chat.id;

        if (userId && chatId) {
            const relUserChat = new RelUsersChats();
            relUserChat.replace().set("user_id", userId).set("chat_id", chatId);
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
    protected warnNamechanging(
        user: Object,
        userObject: Record<string, any>
    ): void {}

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
