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
import { controllers } from "./config/controllers";

export default class App {

    /**
     * Express application instance.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {express.Application}
     */
    private expressApp: express.Application;

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
        this.expressApp = express();
        this.port = (process.env.PORT || 3000) as number;

        this.initializeMiddlewares();
        this.initializeControllers();
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
        this.expressApp.listen(this.port, () => {
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

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");

        const hours = (date.getHours()).toString().padStart(2, "0");
        const minutes = (date.getMinutes()).toString().padStart(2, "0");
        const seconds = (date.getSeconds()).toString().padStart(2, "0");

        const filename = `${year}-${month}-${day}.log`;
        fs.appendFileSync(`./log/${filename}`, `${hours}:${minutes}:${seconds} :: ${content}\n`);
    }

    /**
     * Initializes the controllers.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     */
    private initializeControllers(): void {
        controllers.forEach((controller) => {
            this.expressApp.use("/", (new controller(this)).getRoutes());
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
        this.expressApp.use(express.json());
        this.expressApp.use(express.urlencoded({ extended : true }));
    }
}
