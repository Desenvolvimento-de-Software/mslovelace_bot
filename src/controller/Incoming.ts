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
import Controller from "./Controller.js";
import AskToAskAction from "./action/AskToAsk.js";
import CheckRestriction from "./action/CheckRestriction.js";
import Context from "../library/Context.js";
import NewChatMember from "./action/NewChatMember.js";
import LeftChatMember from "./action/LeftChatMember.js";
import Ping from "./action/Ping.js";
import CaptchaConfirmationCallback from "./callback/CaptchaConfirmation.js";
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
import YarnCallback from "./callback/Yarn.js";
import YarnCommand from "./command/Yarn.js";

export default class IncomingController extends Controller {

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
        // this.initializeActions();
        // this.initializeCommands();
        // this.initializeCallbacks();
    }

    /**
     * Controller's main route.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public index(request: Record<string, any>, response: Record<string, any>): void {

        if (request.params.auth !== process.env.AUTH) {
            this.forbidden(request, response);
            return;
        }

        this.handle(request.body);
        response.status(200).send();
    };

    /**
     * Handles the incoming message.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param {Record<string, any>} payload
     */
     public async handle(payload: Record<string, any>): Promise<void> {

        const context = new Context(payload);
        return;
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
    };

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
}
