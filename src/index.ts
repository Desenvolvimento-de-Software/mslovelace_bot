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

import App from "./App.js";
import DefaultController from "./controller/Controller.js";
import IncomingController from "./controller/Incoming.js";

console.log("    _       _         _                   _");
console.log("   / \\   __| | __ _  | |    _____   _____| | __ _  ___ ___");
console.log("  / _ \\ / _` |/ _` | | |   / _ \\ \\ / / _ \\ |/ _` |/ __/ _ \\");
console.log(" / ___ \\ (_| | (_| | | |__| (_) \\ V /  __/ | (_| | (_|  __/");
console.log("/_/   \\_\\__,_|\\__,_| |_____\\___/ \\_/ \\___|_|\\__,_|\\___\\___|");
console.log("");

const app = new App();

app.addControllers([
    new DefaultController(app),
    new IncomingController(app)
]);

app.listen();
