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

import DefaultController from "./controller";
import User from "../model/users";

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
    public index(request: Record<string, any>, response: Record<string, any>): void {

        if (request.params.auth !== process.env.AUTH) {
            response.status(403).send("Forbidden");
        }

        const user = new User();
        user.select()
            .where("user_id").equal(request.body.message.from.id)
            .and("chat_id").equal(request.body.message.chat.id)
            .groupBy("user_id")
            .orderBy("user_id", "DESC")
            .offset(0)
            .limit(1);

        user.execute();

        const body = request.body;
        response.status(200).send();
    }

    /**
     * Initializes the controller's routes.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected initializeRoutes(): void {
        this.router.post(this.path + "/:auth", this.index);
    }
}
