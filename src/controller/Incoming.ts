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

import App from "../App.js";
import DefaultController from "./Controller.js";
import AskToAskAction from "./action/AskToAsk.js";
import CheckRestriction from "./action/CheckRestriction.js";
import NewChatMember from "./action/NewChatMember.js";
import LeftChatMember from "./action/LeftChatMember.js";
import Ping from "./action/Ping.js";
import CaptchaConfirmation from "./callback/CaptchaConfirmation.js";
import AdaShieldCommand from "./command/AdaShield.js";
import AskCommand from "./command/Ask.js";
import BanCommand from "./command/Ban.js";
import GreetingsCommand from "./command/Greetings.js";
import KickCommand from "./command/Kick.js";
import NpmCommand from "./command/Npm.js";
import RestrictCommand from "./command/Restrict.js";
import SendCommand from "./command/Send.js";
import StartCommand from "./command/Start.js";
import UnbanCommand from "./command/Unban.js";

export default class IncomingController extends DefaultController {

    /**
     * Actions object.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @type {Record<string, any>}
     */
    private actions: Record<string, Array<any>> = {};

    /**
     * Commands object.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @type {Record<string, any>}
     */
    private commands: Record<string, any> = {};

    /**
     * Callbacks object.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     *
     * @type {Record<string, any>}
     */
    private callbacks: Record<string, any> = {};

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    constructor(app: App) {
        super(app, "/incoming");
        this.initializeActions();
        this.initializeCommands();
        this.initializeCallbacks();
    }

    /**
     * Controller's main route.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public index(request: Record<string, any>, response: Record<string, any>): void {

        if (request.params.auth !== process.env.AUTH) {
            response.status(401).send("Forbidden");
        }

        const payload = request.body;

        if (!payload.message) {
            response.status(200).send();
        }

        this.handle(payload);
        response.status(200).send();
    }

    /**
     * Handles the incoming message.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {Record<string, any>} payload
     */
     public async handle(payload: Record<string, any>): Promise<void> {

        let message;

        if (typeof payload.message !== "undefined") {
            message = payload.message;

        } else if (typeof payload.edited_message !== "undefined") {
            message = payload.edited_message;
        }

        if (message) {

            try {

                await this.saveUserAndChat(message.from, message.chat);
                this.saveMessage(payload);

            } catch (err: any) {
                this.app.log(err.toString());
            }
        }

        switch (true) {

            case this.isCommand(payload):
                this.handleCommand(payload);
                break;

            default:
                this.handleAction(payload);
                this.handleCallback(payload);
        }
    }

    /**
     * Forbidden action.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param request
     * @param response
     */
    public forbidden(request: Record<string, any>, response: Record<string, any>): void {
        response.status(401).send("Forbidden");
    }

    /**
     * Initializes the controller's routes.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected initializeRoutes(): void {
        this.router.post(this.path + "/:auth", this.index.bind(this));
        this.router.all(this.path, this.forbidden.bind(this));
    }

    /**
     * Returns whether the incoming message is a command or not.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected isCommand(payload: Record<string, any>): boolean {
        return (
            typeof payload.message !== "undefined" &&
            typeof payload.message.entities !== "undefined" &&
            payload.message.entities[0].type === "bot_command"
        );
    }

    /**
     * Handles the incoming command.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected async handleCommand(payload: Record<string, any>): Promise<void> {

        this.deleteMessage(
            payload.message.message_id,
            payload.message.chat.id
        );

        const instruction = payload.message.text.replace("/", "").split(" ");
        const command = instruction[0].split("@")[0];

        if (!this.commands.hasOwnProperty(command)) {
            return;
        }

        const commandInstance = new this.commands[command](this.app);

        let method = "index";
        if (typeof instruction[1] !== "undefined" && typeof commandInstance[instruction[1]] === "function") {
            method = instruction[1];
        }

        const args = instruction.length > 2 ? instruction.slice(2) : [];

        try {
            commandInstance[method](payload, ...args);

        } catch (err: any) {
            this.app.log(err.toString());
        }
    }

    /**
     * Handles the incoming action.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected async handleAction(payload: Record<string, any>): Promise<void> {

        if (typeof payload.message === "undefined") {
            return;
        }

        for (let action in this.actions) {
            if (payload.message.hasOwnProperty(action)) {
                this.actions[action].map((classname) => {
                    (new classname(this.app)).run(payload);
                })
            }
        }
    }

    /**
     * Handles the callbacks.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected async handleCallback(payload: Record<string, any>): Promise<void> {

        if (typeof payload.callback_query === "undefined") {
            return;
        }

        const data = JSON.parse(payload.callback_query.data);
        if (this.callbacks.hasOwnProperty(data.callback)) {
            const className = this.callbacks[data.callback];
            (new className(this.app)).run(payload, data.data);
        }
    }

    /**
     * Initializes the BOT's actions.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private initializeActions(): void {
        this.actions = {
            photo : [CheckRestriction],
            entities : [CheckRestriction, Ping],
            new_chat_member : [NewChatMember],
            left_chat_member : [LeftChatMember],
            text : [AskToAskAction]
        };
    }

    /**
     * Initializes the BOT's commands.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private initializeCommands(): void {
        this.commands = {
            adashield : AdaShieldCommand,
            ask : AskCommand,
            ban : BanCommand,
            greetings : GreetingsCommand,
            kick : KickCommand,
            npm : NpmCommand,
            restrict : RestrictCommand,
            send : SendCommand,
            start : StartCommand,
            unban : UnbanCommand,
        };
    }

    /**
     * Initializes the BOT's callbacks.
     *
     * @author Marcos Leandro
     * @since  2022-09-16
     */
    private initializeCallbacks(): void {
        this.callbacks = {
            captchaconfirmation : CaptchaConfirmation
        }
    }
}
