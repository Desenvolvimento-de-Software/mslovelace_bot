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

import Callback from "./Callback";
import Context from "context/Context";
import YarnCommand from "../command/Yarn";

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

        const callbackQuery = this.context.getCallbackQuery();
        if (!callbackQuery?.callbackData.d.package) {
            return;
        }

        const yarnCommand = new YarnCommand();
        await yarnCommand.getPackage(callbackQuery?.callbackData.d.package);
        callbackQuery.answer(this.context.getCallbackQuery()?.callbackData.d.package.toUpperCase());
    }
}
