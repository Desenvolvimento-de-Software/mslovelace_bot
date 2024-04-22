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
import ChatHelper from "../helper/Chat.js";
import NpmPackage from "../helper/NpmPackage.js";
import Lang from "../helper/Lang.js";
import Log from "../helper/Log.js";
import { exec } from "child_process";

export default class Npm extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-21
     *
     * @param {Context} context
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["npm"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since 2023-06-13
     */
     public async run(): Promise<void> {

        const text = this.context.message.getText().split(/\s+/);
        if (!text.length || text.length < 2) {
            return;
        }

        const library = text[1].replace(/[^\w\d_-]/g, '').toLowerCase();
        if (!library.length) {
            return;
        }

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language || "us");

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
            return;
        }

        if (stderr) {
            Log.save(stderr);
            return;
        }

        const json = await JSON.parse(stdout);
        if (!json.length) {
            return;
        }

        const library = json[0];
        const npmPackage = new NpmPackage(library);

        const options: Record<string, any> = {
            disableWebPagePreview: true,
            parseMode: "HTML"
        };

        if (this.context.message.getReplyToMessage()) {
            options.replyToMessageId = this.context.message.getReplyToMessage()?.getId();
        }

        this.context.chat.sendMessage(npmPackage.getMessage(), options);
    }
}
