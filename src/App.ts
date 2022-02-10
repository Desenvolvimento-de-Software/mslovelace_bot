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

import fs from "fs";
import express from "express";
import bodyParser from "body-parser";
import IncomingController from "./controller/Incoming.js";
import DefaultController from "./controller/Controller.js";
import GetUpdates from "./library/telegram/resource/GetUpdates.js";

export default class App {

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
    constructor() {
        this.app  = express();
        this.port = (process.env.PORT || 3000) as number;

        this.initializeMiddlewares();

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
     public addControllers(controllers: Array<DefaultController>): void {
        controllers.forEach((controller) => {
            this.app.use("/", controller.getRoutes());
        });
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
            console.log(`Listening on port ${this.port}`);
        });
    }

    /**
     * Saves an entry to the log.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param content
     */
    public log(content: string): void {

        const date = new Date();

        const year  = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day   = (date.getDate()).toString().padStart(2, "0");

        const hours   = (date.getHours()).toString().padStart(2, "0");
        const minutes = (date.getMinutes()).toString().padStart(2, "0");
        const seconds = (date.getSeconds()).toString().padStart(2, "0");

        const filename = `${year}-${month}-${day}.log`;
        fs.appendFileSync(`./log/${filename}`, `${hours}:${minutes}:${seconds} :: ${content}\n`);
    }

    /**
     * Initializes the middlewares.
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @return {void}
     */
    private initializeMiddlewares(): void {
        this.app.use(bodyParser.json({ type: "*/*" }));
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

        try {

            const response = await request.post();
            const json     = await response.json();

            let newOffset;

            for (let i = 0, length = json.result.length; i < length; i++) {

                const update = json.result[i];
                newOffset    = update.update_id + 1;

                (new IncomingController(this)).handle(update);
            }

            this.initializeLongPolling(newOffset);

        } catch (err) {
            this.initializeLongPolling();
        }
    }
}
