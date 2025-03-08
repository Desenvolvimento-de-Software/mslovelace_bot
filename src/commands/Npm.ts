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
import CommandContext from "contexts/Command";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import NpmPackage from "helpers/NpmPackage";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { exec } from "child_process";
import { getChatByTelegramId } from "services/Chats";

export default class Npm extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "npm", description: "Shows a package details from npm with [npm package]." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-21
     */
    public constructor() {
        super();
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since 2023-06-13
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
     public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        const text = this.context.getMessage()?.getText().split(/\s+/) ?? "";
        if (!text.length || text.length < 2) {
            return Promise.resolve();
        }

        const library = text[1].replace(/[^\w-]/g, '').toLowerCase();
        if (!library.length) {
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await getChatByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        Lang.set(chat.language ?? "en");

        try {

            exec(`npm search --json ${library}`, (error: any, stdout: string, stderr: string) => {
                this.processResponse(error, stdout, stderr);
            });

        } catch (err: any) {
            Log.save(err.toString(), err.stack);
        }
    }

    /**
     * Processes the shell response.
     *
     * @author Marcos Leandro
     * @since  2022-09-21
     *
     * @param error
     * @param stdout
     * @param stderr
     */
    private async processResponse(error: any, stdout: string, stderr: string): Promise<void> {

        if (error) {
            Log.save(error.message, error.skack || undefined);
            return Promise.resolve();
        }

        if (stderr) {
            Log.save(stderr);
            return Promise.resolve();
        }

        const json = await JSON.parse(stdout);
        if (!json.length) {
            return Promise.resolve();
        }

        const library = json[0];
        const npmPackage = new NpmPackage(library);

        const options: Record<string, any> = {
            disable_web_page_preview: true,
            parse_mode: "HTML"
        };

        if (this.context?.getMessage()?.getReplyToMessage()) {
            options.replyToMessageId = this.context?.getMessage()?.getReplyToMessage()?.getId();
        }

        this.context?.getChat()?.sendMessage(npmPackage.getMessage(), options);
    }
}
