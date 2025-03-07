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
import App from "App";
import Action from "actions/Action";
import Command from "commands/Command";
import Callback from "callbacks/Callback";
import CallbackQuery from "contexts/CallbackQuery";
import Context from "contexts/Context";
import ContextFactory from "contexts/ContextFactory";
import Log from "helpers/Log";
import { actions } from "configs/actions";
import { callbacks } from "configs/callbacks";
import { Update as UpdateType } from "libraries/telegram/types/Update";

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
        this.path = path ?? "/";
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
     * @param {UpdateType} payload
     */
    protected async handle(payload: UpdateType): Promise<void> {

        if (!payload.update_id) {
            Log.save("Invalid payload.\n" + JSON.stringify(payload), "", false, "error");
            return Promise.resolve();
        }

        try {

            const context = ContextFactory.create(payload);
            if (!context) {
                return Promise.resolve();
            }

            this.handleActions(context);
            this.handleCommands(context);
            this.handleCallbacks(context);

        } catch (error: unknown) {
            if (error instanceof Error) {
                error.message.length && (Log.save(error.message, error.stack, false, "error"));
            }
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
        for (const command of this.app.getCommands()) {
            this.executeCommand(command, context);
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
            const callback = new callbackName(context as CallbackQuery);
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
     * @param command
     */
    private async executeCommand(command: Command, context: Context): Promise<void> {

        const commandContext = command.isCalled(context);
        if (!commandContext) {
            return Promise.resolve();
        }

        try {

            await command.run(commandContext, context);

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
