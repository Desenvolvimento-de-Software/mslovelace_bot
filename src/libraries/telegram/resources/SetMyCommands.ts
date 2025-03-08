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

import TelegramBotApi from "../TelegramBotApi";
import {BotCommand} from "../types/BotCommand";
import {BotCommandScope} from "../types/BotCommandScope";

export default class SetMyCommands extends TelegramBotApi {

    /**
     * Method payload.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     */
    protected payload: Record<string, any> = {};

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     */
    public constructor() {
        super("setMyCommands");
    }

    /**
     * Sets the bot command list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @param  commands
     *
     * @return {SetMyCommands}
     */
    public setCommands(commands: BotCommand[]): this {
        this.payload.commands = commands;
        return this;
    }

    /**
     * Adds the scope, describing scope of users for which the commands are relevant.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @param scope
     *
     * @return {SetMyCommands}
     */
    public setScope(scope: BotCommandScope): this {
        this.payload.scope = scope;
        return this;
    }

    /**
     * Sets a two-letter ISO 639-1 language code.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @param languageCode
     *
     * @return {SetMyCommands}
     */
    public setLanguageCode(languageCode: string): this {
        this.payload.language_code = languageCode;
        return this;
    }
}
