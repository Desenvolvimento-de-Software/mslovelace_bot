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

import App from "../App";
import Command from "./Command";
import SendMessage from "../library/telegram/resource/SendMessage";
import ChatHelper from "../helper/Chat";
import Lang from "../helper/Lang";

export default class Unban extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor(app: App) {
        super(app);
    }
}
