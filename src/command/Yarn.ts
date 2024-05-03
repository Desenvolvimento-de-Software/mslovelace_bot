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
import BotCommand from "../library/telegram/type/BotCommand.js";
import Command from "./Command.js";
import ChatHelper from "../helper/Chat.js";
import YarnPackage from "../helper/YarnPackage.js";
import Lang from "../helper/Lang.js";
import Log from "../helper/Log.js";
import { exec } from "child_process";

export default class Yarn extends Command {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    private static commands: BotCommand[] = [
        { command : "yarn", description : "Shows a package details from yarn with [yarn package]." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param app
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
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
        this.getPackage(library);
    }

    /**
     * Gets the package from yarn.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param library
     */
    public async getPackage(library: String): Promise<void> {

        try {

            exec(`yarn info --json ${library}`, (error: any, stdout: string, stderr: string) => {
                this.processResponse(error, stdout, stderr);
            });

        } catch (err: any) {
            Log.save(err.message, err.stack);
        }
    }

    /**
     * Processes the shell response.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param error
     * @param stdout
     * @param stderr
     */
    private async processResponse(error: any, stdout: string, stderr: string): Promise<void> {

        if (error) {
            Log.save(error.message, error.stack);
            return;
        }

        if (stderr) {
            Log.save(stderr);
            return;
        }

        const library = await JSON.parse(stdout);
        if (!library) {
            return;
        }

        const yarnPackage = new YarnPackage(library);
        if (this.context.callbackQuery) {
            return this.updateMessage(yarnPackage);
        }

        return this.sendNewMessage(yarnPackage);
    }

    /**
     * Sends a new message.
     *
     * @author Marcos Leandro
     * @since  2022-10-20
     *
     * @param yarnPackage
     */
    async sendNewMessage(yarnPackage: YarnPackage): Promise<void> {

        const chat = await ChatHelper.getByTelegramId(this.context.chat.getId());
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language || "us");

        const options: Record<string, any> = {
            disableWebPagePreview: true,
            parseMode: "HTML"
        };

        const dependencies = yarnPackage.getDependencies();
        if (dependencies) {
            options.replyMarkup = dependencies;
        }

        if (this.context.message.getReplyToMessage()) {
            options.replyToMessageId = this.context.message.getReplyToMessage()?.getId();
        }

        this.context.chat.sendMessage(yarnPackage.getMessage(), options);
    }

    /**
     * Edits the existing message.
     *
     * @author Marcos Leandro
     * @since  2022-10-20
     *
     * @param {YarnPackage} yarnPackage
     */
    async updateMessage(yarnPackage: YarnPackage): Promise<void> {

        const options: Record<string, any> = {
            disableWebPagePreview: true,
            parseMode: "HTML"
        };

        const dependencies = yarnPackage.getDependencies();
        if (dependencies) {
            options.replyMarkup = dependencies;
        }

        this.context.message.edit(yarnPackage.getMessage(), options);
    }
}
