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

export default abstract class Action {

    /**
     * Current context.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     */
    protected context: Context;

    /**
     * Action execute type [sync|async].
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @var string
     */
    private type: string;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param context
     * @param type
     */
    public constructor(context: Context, type?: string) {
        this.context = context;
        this.type = type || "sync";
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    public async run(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    /**
     * Return the action type.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns {boolean}
     */
    public isSync(): boolean {
        return this.type === "sync";
    }
}
