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

import Command from "./Command.js";
import Context from "../library/telegram/context/Context.js";
import { BotCommand } from "../library/telegram/type/BotCommand.js";
import Lang from "../helper/Lang.js";
import Text from "../helper/Text.js";
import UserHelper from "../helper/User.js";

export default class Privacy extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
        { command: "privacy", description: "Shows the privacy policy." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     *
     * @returns
     */
    public async run(): Promise<void> {

        if (this.context.chat.getType() !== "private") {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(this.context.user.getId());
        if (!user || !user.id) {
            return;
        }

        Lang.set(user.language_code || "us");

        this.context.chat.sendMessage(Lang.get("privacyPolicy"), { parseMode: "HTML" });
        return Promise.resolve();
    }
}
