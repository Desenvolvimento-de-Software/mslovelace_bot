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

import Context from "../library/telegram/context/Context.js";
import Callback from "./Callback.js";
import YarnCommand from "../command/Yarn.js";

export default class Yarn extends Callback {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor(context: Context) {
        super(context);
        this.setCallbacks(["yarn"]);
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param payload
     * @param data
     */
     public async run(): Promise<void> {

        if (!this.context.callbackQuery?.callbackData.d.package) {
            return;
        }

        const yarnCommand = new YarnCommand(this.context);
        await yarnCommand.getPackage(this.context.callbackQuery?.callbackData.d.package);
        this.context.callbackQuery.answer(this.context.callbackQuery?.callbackData.d.package.toUpperCase());
    }
}
