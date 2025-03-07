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

import Federation from "./Federation";
import { BotCommand } from "libraries/telegram/types/BotCommand";

export default class User extends Federation {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "fpromote", description: "Promotes a user in the active federation." },
        { command: "fdemote", description: "Demotes a user in the active federation." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    public constructor() {
        super();
    }

    /**
     * Promotes an user in the active federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async fpromote(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Demotes an user in the active federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async fdemote(): Promise<void> {
        return Promise.resolve();
    }
}
