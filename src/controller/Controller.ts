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
import App from "../App";
import Action from "../action/Action";
import Command from "../command/Command";
import Context from "../library/telegram/context/Context";
import TelegramBotApi from "../library/telegram/TelegramBotApi";
import { actions } from "../config/actions";
import { commands } from "../config/commands";

export default interface Controller {
    executeSyncAction(action: Action): void;
    executeAsyncAction(action: Action): void;
}

export default class Controller {

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
     * @param {App}    app
     * @param {string} path
     */
    public constructor(app: App, path?: string) {
        this.app = app;
        this.path = path || "/";
        this.initializeRoutes();
        TelegramBotApi.setToken(process.env.TELEGRAM_BOT_TOKEN || "");
    }

    /**
     * Controller's main route.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {express.Request}  request
     * @param {express.Response} response
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
     * Initializes the controller's routes.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected initializeRoutes(): void {
        this.router.all(this.path, this.index.bind(this));
    }

    /**
     * Handles the incoming message.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {Record<string, any>} payload
     */
    protected async handle(payload: Record<string, any>): Promise<void> {
        const context = new Context(payload);
        this.handleActions(context);
        this.handleCommands(context);
    }

    /**
     * Handles the actions.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param context
     */
    private async handleActions(context: Context): Promise<void> {
        for (const actionName of actions) {
            const action = new actionName(context);
            await this.executeAction(action);
        }
    }

    /**
     * Handles the commands.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param context
     */
    private async handleCommands(context: Context): Promise<void> {
        for (const commandName of commands) {
            const command = new commandName(context);
            await this.executeCommand(command);
        }
    }

    /**
     * Executes the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param action
     *
     * @returns {Promise<void>}
     */
    private async executeAction(action: Action): Promise<void> {

        if (action.isSync()) {
            return await action.run();
        }

        return action.run();
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     *
     * @returns {Promise<void>}
     */
    private async executeCommand(command: Command): Promise<void> {
        const commandContext = command.isCalled();
        if (commandContext) {
            return await command.execute(commandContext);
        }
    }
}
