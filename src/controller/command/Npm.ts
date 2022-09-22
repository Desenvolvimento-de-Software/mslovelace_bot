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

import App from "../../App.js";
import Command from "../Command.js";
import ChatHelper from "../../helper/Chat.js";
import SendMessage from "../../library/telegram/resource/SendMessage.js";
import Lang from "../../helper/Lang.js";
import { exec } from "child_process";

export default class Npm extends Command {

    /**
     * Telegram peyload.
     *
     * @author Marcos Leandro
     * @since  2022-09-21
     */
    private payload: Record<string, any> = {};

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-21
     *
     * @param app
     */
    public constructor(app: App) {
        super(app);
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 2022-09-21
     */
     public async index(payload: Record<string, any>): Promise<void> {

        const text = payload.message.text.split(/\s+/);
        if (!text.length || text.length < 2) {
            return;
        }

        const library = text[1].replace(/[^\w\d_-]/g, '').toLowerCase();
        if (!library.length) {
            return;
        }

        const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
        if (!chat || !chat.id) {
            return;
        }

        Lang.set(chat.language || "us");
        this.payload = payload;

        try {

            exec(`npm search --json ${library}`, (error: any, stdout: string, stderr: string) => {
                this.processResponse(error, stdout, stderr);
            });

        } catch (err: any) {
            this.app.log(err.toString());
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
            this.app.log(error.message);
            return;
        }

        if (stderr) {
            this.app.log(stderr);
            return;
        }

        const json = await JSON.parse(stdout);
        if (!json.length) {
            return;
        }

        const library = json[0];

        let message;
        message  = Lang.get("npmPackageDescription").replace("{description}", library.description + "\n");
        message += Lang.get("npmPackageName").replace("{name}", library.name);
        message += Lang.get("npmPackageVersion").replace("{version}", library.version);
        message += Lang.get("npmPackageDate").replace("{date}", library.date);

        if (library.links) {
            message += "\n" + Lang.get("npmPackageLinks");
            for (let key in library.links) {
                message += Lang.get("npmPackageLink")
                    .replace("{linkname}", key)
                    .replace("{linkurl}", library.links[key]);
            }
        }

        message += "\n";
        if (library.author) {
            message += Lang.get("npmAuthor");
            message += Lang.get("npmPerson").replace("{person}", this.formatPerson(library.author)) + "\n";
        }

        if (library.publisher) {
            message += Lang.get("npmPublisher");
            message += Lang.get("npmPerson").replace("{person}", this.formatPerson(library.publisher)) + "\n";
        }

        if (library.maintainers?.length) {
            message += Lang.get("npmMaintainers");
            for (let maintainer of library.maintainers) {
                message += Lang.get("npmPerson").replace("{person}", this.formatPerson(maintainer));
            }
        }

        message += "\n";
        if (library.keywords?.length) {

            message += Lang.get("npmPackageKeywords");

            let keywords = [];
            for (let keyword of library.keywords) {
                keywords.push(`<code>${keyword}</code>`);
            }

            message += keywords.join(", ") + "\n\n";
        }

        message += Lang.get("npmPackageInstall").replace("{package}", library.name);

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(this.payload.message.chat.id)
            .setText(message)
            .setDisableWebPagePreview(true)
            .setParseMode("HTML");

        if (this.payload.message?.reply_to_message?.message_id) {
            sendMessage.setReplyToMessageId(this.payload.message.reply_to_message.message_id);
        }

        sendMessage.post();
    }

    /**
     * Formats the person.
     *
     * @author Marcos Leandro
     * @since  2022-09-21
     *
     * @param person
     *
     * @return string
     */
    private formatPerson(person: Record<string, string>): string {
        const name = person.name || person.username || "Unknown";
        const email = person.email || null;
        return email ? `<a href="mailto:${email}">${name}</a>` : name;
    }
}
