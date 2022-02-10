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
import GreetingsCommand from "./command/Greetings.js";
import StartCommand from "./command/Start.js";
import KickCommand from "./command/Kick.js";
import BanCommand from "./command/Ban.js";
import RestrictCommand from "./command/Restrict.js";
import UnbanCommand from "./command/Unban.js";
import CheckRestriction from "./action/CheckRestriction.js";
import NewChatMember from "./action/NewChatMember.js";
import LeftChatMember from "./action/LeftChatMember.js";

export default class IncomingController extends DefaultController {

    /**
     * Actions object.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @type {Record<string, any>}
     */
    private actions: Record<string, any> = {};

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
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    constructor(app: App) {
        super(app, "/incoming");
        this.initializeActions();
        this.initializeCommands();
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
    public handle(payload: Record<string, any>): void {

        let message;

        if (typeof payload.message !== "undefined") {
            message = payload.message;

        } else if (typeof payload.edited_message !== "undefined") {
            message = payload.edited_message;
        }

        if (message.length) {
            this.saveUserAndChat(
                message.from,
                message.chat
            );
        }

        switch (true) {

            case this.isCommand(payload):
                this.handleCommand(payload);
                break;

            default:
                this.handleAction(payload);
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
        const command     = instruction[0].split("@")[0];

        const method = (
            (
                typeof instruction[1] !== "undefined" &&
                this.commands[command].hasOwnProperty(instruction[1])
            ) ? instruction[1] : "index"
        );

        const args = instruction.length > 2 ? instruction.slice(2) : [];

        if (typeof this.commands[command] !== "undefined") {

            const className = this.commands[command];

            try {

                (new className(this.app))[method](payload, ...args);

            } catch (err: any) {
                this.app.log(err.toString());
            }
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
                const className = this.actions[action];
                (new className(this.app)).run(payload);
            }
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
            photo            : CheckRestriction,
            entities         : CheckRestriction,
            new_chat_member  : NewChatMember,
            left_chat_member : LeftChatMember
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
            greetings : GreetingsCommand,
            start     : StartCommand,
            kick      : KickCommand,
            ban       : BanCommand,
            unban     : UnbanCommand,
            restrict  : RestrictCommand
        };
    }
}
