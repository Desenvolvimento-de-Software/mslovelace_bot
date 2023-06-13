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
import { controllers } from "./config/controllers.js";

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
