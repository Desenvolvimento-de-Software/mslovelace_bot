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
import User from "@model/users";

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

        const select = new User();
        select
            .select()
            .where("user_id").equal(request.body.message.from.id)
            .and("chat_id").equal(request.body.message.chat.id)
            .and("id").in([1, "abc", true, null])
            .groupBy("user_id")
            .orderBy("user_id", "DESC")
            .offset(0)
            .limit(1);

        const insert = new User();
        insert
            .insert()
            .set("user_id", 123)
            .set("chat_id", "445")
            .set("first_name", "Marcos")
            .set("last_name", "Leandro")
            .set("username", true)
            .set("language_code", null);

            const replace = new User();
            replace
                .replace()
                .set("user_id", 123)
                .set("chat_id", "445")
                .set("first_name", "Marcos")
                .set("last_name", "Leandro")
                .set("username", true)
                .set("language_code", null);

            const update = new User();
            update
                .update()
                .set("user_id", 123)
                .set("chat_id", "445")
                .set("first_name", "Marcos")
                .set("last_name", "Leandro")
                .set("username", true)
                .set("language_code", null)
                .where("id").equal(1)
                .and("status").equal(0);

        const body = request.body;
        response.status(200).send(
            [
                select.execute(),
                insert.execute(),
                replace.execute(),
                update.execute()
            ].join("\n\n")
        );
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
