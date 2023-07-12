/**
 * Catbot Telegram Bot
 *
 * This file is part of Catbot Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  moe_catbot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import DefaultController from "../controller/Controller.js";
import IncomingController from "../controller/Incoming.js";
import PollingController from "../controller/Polling.js";

export const controllers = [
    DefaultController,
    IncomingController,
    PollingController
];
