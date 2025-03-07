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

import Command from "./Command";
import Context from "contexts/Context";
import CommandContext from "contexts/Command";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import Lang from "helpers/Lang";
import UserHelper from "helpers/User";

export default class Privacy extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "privacy", description: "Shows the privacy policy." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     */
    public constructor() {
        super();
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (this.context.getChat()?.getType() !== "private") {
            return Promise.resolve();
        }

        const userId = this.context.getUser()?.getId();
        if (!userId) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(userId);
        if (!user?.id) {
            return Promise.resolve();
        }

        Lang.set(user.language_code || "en");

        this.context.getChat()?.sendMessage(Lang.get("privacyPolicy"), { parse_mode : "HTML" });
        return Promise.resolve();
    }
}
