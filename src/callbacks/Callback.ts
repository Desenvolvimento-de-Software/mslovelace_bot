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

import CallbackQuery from "contexts/CallbackQuery";

export default abstract class Callback {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {Context}
     */
    protected context: CallbackQuery;

    /**
     * Registered callbacks.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @var {string[]}
     */
    private callbacks: string[] = [];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 2023-06-07
     *
     * @param context
     * @param type
     */
    public constructor(context: CallbackQuery) {
        this.context = context;
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  2023-06-12
     */
    public async run(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Returns whether the command is valid.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @return {boolean}
     */
    public isCalled(): boolean {

        let callbackData;
        if (typeof this.context?.getData === "function") {
            callbackData = this.context?.getData() ?? undefined;
        }

        if (!callbackData?.c) {
            return false;
        }

        return typeof callbackData.c === "string" && this.callbacks.includes(callbackData.c);
    }

    /**
     * Registers the callbacks.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param callbacks
     */
    protected setCallbacks(callbacks: string[]): void {
        this.callbacks = callbacks;
    }
}
