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

import Context from "context/Context";
import CommandContext from "context/Command";
import { BotCommand } from "../library/telegram/type/BotCommand";
import Command from "./Command";
import ChatHelper from "../helper/Chat";
import YarnPackage from "../helper/YarnPackage";
import Lang from "../helper/Lang";
import Log from "../helper/Log";
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
    public readonly commands: BotCommand[] = [
        { command : "yarn", description : "Shows a package details from yarn with [yarn package]." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     */
    public constructor() {
        super();
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        const text = this.context.getMessage()?.getText().split(/\s+/);
        if (!text?.length || text.length < 2) {
            return Promise.resolve();
        }

        const library = text[1].replace(/[^\w-]/g, '').toLowerCase();
        if (!library.length) {
            return Promise.resolve();
        }

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");
        this.getPackage(library);

        return Promise.resolve();
    }

    /**
     * Gets the package from yarn.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param library
     */
    public async getPackage(library: string): Promise<void> {

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
    private readonly processResponse = async (error: any, stdout: string, stderr: string): Promise<void> => {

        if (error) {
            Log.save(error.message, error.stack);
            return Promise.resolve();
        }

        if (stderr) {
            Log.save(stderr);
            return Promise.resolve();
        }

        const library = await JSON.parse(stdout);
        if (!library) {
            return Promise.resolve();
        }

        const yarnPackage = new YarnPackage(library);
        if (this.context?.getCallbackQuery()) {
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

        const chatId = this.context?.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat?.id) {
            return Promise.resolve();
        }

        Lang.set(chat.language || "en");

        const options: Record<string, any> = {
            disable_web_page_preview: true,
            parse_mode: "HTML"
        };

        const dependencies = yarnPackage.getDependencies();
        if (dependencies) {
            options.replyMarkup = dependencies;
        }

        if (this.context?.getMessage()?.getReplyToMessage()) {
            options.replyToMessageId = this.context.getMessage()?.getReplyToMessage()?.getId() ?? null;
        }

        this.context?.getChat()?.sendMessage(yarnPackage.getMessage(), options);
        return Promise.resolve();
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
            disable_web_page_preview: true,
            parse_mode: "HTML"
        };

        const dependencies = yarnPackage.getDependencies();
        if (dependencies) {
            options.replyMarkup = dependencies;
        }

        this.context?.getMessage()?.edit(yarnPackage.getMessage(), options);
    }
}
