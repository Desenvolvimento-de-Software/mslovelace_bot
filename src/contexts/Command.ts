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

import { Options as OptionsType } from "types/Options";

export default class Command {

    /**
     * The command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {string}
     */
    private readonly command: string;

    /**
     * Command start.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {number}
     */
    private readonly start: number;

    /**
     * Command end.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {number}
     */
    private readonly end: number;

    /**
     * Command params.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @var {string}
     */
    private readonly params?: string[];

    /**
     *  The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     * @param params
     */
    public constructor(command: string, options: OptionsType) {
        this.command = command;
        this.start = options.start;
        this.end = options.end;

        if (options.params) {
            this.params = options.params.split(" ");
        }
    }

    /**
     * Returns the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns {string}
     */
    public getCommand(): string {
        return this.command;
    }

    /**
     * Returns the command start.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns {string}
     */
    public getStart(): number {
        return this.start;
    }

    /**
     * Returns the command end.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns {string}
     */
    public getEnd(): number {
        return this.end;
    }

    /**
     * Returns the command params.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns {string[]}
     */
    public getParams(): string[]|undefined {
        return this.params;
    }
}
