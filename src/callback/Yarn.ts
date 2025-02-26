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
import CallbackQuery from "context/CallbackQuery";
import Command from "context/Command";
import YarnCommand from "../command/Yarn";
import { Options as OptionsType } from "type/Options";

export default class Yarn extends Callback {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor(context: CallbackQuery) {
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

        let callbackData;
        if (typeof this.context?.getData === "function") {
            callbackData = this.context?.getData() ?? undefined;
        }

        if (!callbackData?.d || typeof callbackData.d !== "object") {
            return Promise.resolve();
        }

        if (!("package" in callbackData.d) || !callbackData.d.package) {
            return Promise.resolve();
        }

        const options: OptionsType = {
            start: 0,
            end: 5,
            params: callbackData.d.package as string
        };

        const commandContext = new Command("yarn", options);
        const yarnCommand = new YarnCommand();
        yarnCommand.run(commandContext, this.context);

        this.context.answer((callbackData.d.package as string).toUpperCase());
    }
}
