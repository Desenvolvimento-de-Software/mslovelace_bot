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

import App from "./app.js";
import path from "path";
import dotenv from "dotenv";
import DefaultController from "./controller/Controller.js";
import IncomingController from "./controller/Incoming.js";

console.log( path.resolve());
dotenv.config({
    path : path.resolve() + "/.env"
});

const app = new App([
    new DefaultController(),
    new IncomingController()
]);

app.listen();
