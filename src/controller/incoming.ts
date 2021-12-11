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

import DefaultController from "@controller/controller";
import UserHelper from "@helper/user";
import ChatHelper from "@helper/chat";
import RelUsersChats from "@model/relUsersChats";

export default class IncomingController extends DefaultController {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    constructor() {
        super("/incoming");
    }

    /**
     * Controller's main route.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public index(request: Record<string, any>, response: Record<string, any>) {

        if (request.params.auth !== process.env.AUTH) {
            response.status(401).send("Forbidden");
        }

        const payload = request.body;

        this.saveUserAndChat(payload);

        switch (true) {

            case this.isCommand(payload):
                this.handleCommand(payload);
                break;

            default:
                this.handleAction(payload);
        }

        response.status(200).send();
    }

    /**
     * Initializes the controller's routes.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected initializeRoutes(): void {
        this.router.post(this.path + "/:auth", this.index.bind(this));
    }

    /**
     * Returns whether the incoming message is a command or not.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected isCommand(payload: Record<string, any>): boolean {
        return (
            typeof payload.message.entities !== "undefined" &&
            payload.message.entities[0].type === "bot_command"
        );
    }

    /**
     * Handles the incoming command.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected handleCommand(payload: Record<string, any>): void {
        console.log("handleCommand");
    }

    /**
     * Handles the incoming action.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected handleAction(payload: Record<string, any>): void {
        console.log("handleAction");
    }

    /**
     * Saves the user and group.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
    private async saveUserAndChat(payload: Record<string, any>): Promise<any> {

        const user   = await UserHelper.getUserByTelegramId(payload.message.from.id);
        const userId = (user === null ? await UserHelper.createUser(payload.message.from) : user.id);

        this.warnNamechanging(user, payload);

        const chat   = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
        const chatId = (chat === null ? await ChatHelper.createChat(payload.message.chat) : chat.id);

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
    private warnNamechanging(user: Object, payload: Record<string, any>): void {
    }
}
