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
import App from "../App.js";
import Action from "../action/Action.js";
import Command from "../command/Command.js";
import Callback from "../callback/Callback.js";
import Context from "../library/telegram/context/Context.js";
import Log from "../helper/Log.js";
import { actions } from "../config/actions.js";
import { commands } from "../config/commands.js";
import { callbacks } from "../config/callbacks.js";

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
     * @return {express.Router}
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

        if (!payload.update_id) {
            Log.save("Invalid payload.\n" + JSON.stringify(payload), "", false, "error");
            return Promise.resolve();
        }

        try {

            const context = new Context(payload);
            this.handleActions(context);
            this.handleCommands(context);
            this.handleCallbacks(context);

        } catch (error: any) {
            Log.save(error.message, error.stack, true, "error");
        }
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
        for (const commandClass of commands) {
            Command.isCalled(commandClass, context) === undefined || (this.executeCommand(commandClass, context));
        }
    }

    /**
     * Handles the callbacks.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @param context
     */
    private async handleCallbacks(context: Context): Promise<void> {
        for (const callbackName of callbacks) {
            const callback = new callbackName(context);
            this.executeCallback(callback);
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
     * @return {Promise<void>}
     */
    private async executeAction(action: Action): Promise<void> {

        try {
            return (action.isSync()) ? await action.run() : action.run();

        } catch (error: any) {
            Log.save(error.message, error.stack);
        }
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param commandClass
     */
    private async executeCommand(commandClass: Command, context: Context): Promise<void> {

        const commandContext = Command.isCalled(commandClass, context);

        try {

            const command = new commandClass(context);
            await command.run(commandContext);

        } catch (error: any) {
            Log.save(error.message, error.stack);
        }
    }

    /**
     * Executes the callback.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     *
     * @param callback
     */
    private executeCallback(callback: Callback): void {

        try {

            !callback.isCalled() || callback.run();

        } catch (error: any) {
            Log.save(error.message, error.stack);
        }
    }
}
