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
import bodyParser from "body-parser";
import IncomingController from "./controller/Incoming.js";
import DefaultController from "./controller/Controller.js";
import GetUpdates from "./library/telegram/resource/GetUpdates.js";

class App {

    /**
     * Express application instance.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {express.Application}
     */
    private app: express.Application;

    /**
     * Application port.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {number}
     */
    private port: number;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    constructor(controllers: Array<DefaultController>) {

        this.app  = express();
        this.port = (process.env.PORT || 3000) as number;

        this.initializeMiddlewares();
        this.initializeControllers(controllers);

        if (process.env.TELEGRAM_WEBHOOK_ACTIVE?.toLowerCase() === "false") {
            this.initializeLongPolling();
        }
    }

    /**
     * Starts to listen in the specified port.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @return {void}
     */
    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`App listening on port ${this.port}`);
        });
    }

    /**
     * Initializes the middlewares.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @return {void}
     */
    private initializeMiddlewares(): void {
        this.app.use(bodyParser.json({ type: "*/*" }));
    }

    /**
     * Initializes the controllers.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @return {void}
     */
    private initializeControllers(controllers: Array<DefaultController>): void {
        controllers.forEach((controller) => {
            this.app.use("/", controller.getRoutes());
        });
    }

    /**
     * Makes the long polling to the Telegram API.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number} offset
     */
    private async initializeLongPolling(offset?: number): Promise<void> {

        const request = new GetUpdates();
        if (typeof offset !== "undefined" && offset.toString().length) {
            request.setOffset(offset);
        }

        const response = await request.post();
        const json     = await response.json();

        try {

            let newOffset;

            for (let i = 0, length = json.result.length; i < length; i++) {
                const update = json.result[i];
                newOffset = update.update_id + 1;
                (new IncomingController()).handle(update);
            }

            this.initializeLongPolling(newOffset);

        } catch (err) {
            this.initializeLongPolling();
        }
    }
}

export default App;
