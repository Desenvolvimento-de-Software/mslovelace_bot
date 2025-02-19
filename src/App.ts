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
import TelegramBotApi from "./library/telegram/TelegramBotApi";
import SetMyCommands from "./library/telegram/resource/SetMyCommands";
import Command from "./command/Command";
import Log from "./helper/Log";
import { controllers } from "./config/controllers";
import { commands as commandsConfig } from "./config/commands";

export default class App {

    /**
     * Express application instance.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {express.Application}
     */
    private readonly expressApp: express.Application;

    /**
     * Application port.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @var {number}
     */
    private readonly port: number;

    /**
     * Registered commands.
     *
     * @author Marcos Leandro
     * @since  2025-01-06
     *
     * @var {Command[]}
     */
    private readonly commands: Command[] = [];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    constructor() {

        this.expressApp = express();
        this.port = (process.env.PORT ?? 3000) as number;

        TelegramBotApi.setToken(process.env.TELEGRAM_BOT_TOKEN ?? "");
    }

    /**
     * Initializes the application.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     */
    public async init() {
        await this.registerCommands();
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    /**
     * Returns the controller's commands.
     *
     * @author Marcos Leandro
     * @since  2025-01-06
     *
     * @return {Command[]}
     */
    public getCommands(): Command[] {
        return this.commands;
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
            Log.warn(`Listening on port ${this.port}`);
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

    /**
     * Registers the bot commands.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     */
    private async registerCommands(): Promise<void> {

        const availableCommands = [];
        for (const commandClass of commandsConfig) {
            const commandInstance = new commandClass();
            this.commands.push(commandInstance);
            availableCommands.push(...commandInstance.commands);
        }

        if (!availableCommands.length) {
            return;
        }

        Log.info("Registering " + availableCommands.length + " commands...");
        const request = new SetMyCommands();
        request.setCommands(availableCommands);

        const response = await request.post();
        if (response.ok) {
            Log.info("Commands successfully registered");
        }
    }
}
