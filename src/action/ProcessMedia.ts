/**
 * Catbot Telegram Bot
 *
 * This file is part of Catbot Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  moe_catbot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import Action from "./Action.js";
import Context from "../library/telegram/context/Context.js";
import MessageContext from "../library/telegram/context/Message.js";
import { InlineKeyboardButton } from "../library/telegram/type/InlineKeyboardButton.js";
import { InlineKeyboardMarkup } from "../library/telegram/type/InlineKeyboardMarkup.js";
import CatboxUser from "../library/catbox/resource/User.js";
import PathHelper from "../helper/Path.js";
import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import { Blob } from "buffer";

export default class ProcessMedia extends Action {

    /**
     * Sent message ID.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    private message?: MessageContext;

    /**
     * File data.
     *
     * @author Marcos Leandro
     * @since  2023-07-12
     */
    private fileData?: Record<string, any>;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-20
     *
     * @param app
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  2022-09-20
     */
    public async run(): Promise<void> {

        let fileId: string|undefined;

        const methods = [
            "getFileByPhoto",
            "getFileByVideo",
            "getFileByDocument"
        ];

        while (!fileId?.length && methods.length) {
            const method = methods.shift();
            fileId = await this[method as keyof ProcessMedia]() as string|undefined;
        }

        if (typeof fileId === "undefined" || !fileId.length) {
            return;
        }

        this.download(fileId);
    }

    /**
     * Gets the file id by photo.
     *
     * @author Marcos Leandro
     * @since  2023-07-10
     *
     * @return string|undefined
     */
    private getFileByPhoto(): string|undefined {
        const photos = this.context.message.getPhoto();
        const photo = photos?.at(-1);
        return photo?.fileId;
    }

    /**
     * Gets the file id by video.
     *
     * @author Marcos Leandro
     * @since  2023-07-10
     *
     * @return string|undefined
     */
    private getFileByVideo(): string|undefined {
        const video = this.context.message.getVideo();
        return video?.fileId;
    }

    /**
     * Gets the file id by document.
     *
     * @author Marcos Leandro
     * @since  2023-07-10
     *
     * @return string|undefined
     */
    private getFileByDocument(): string|undefined {
        const document = this.context.message.getDocument();
        return document?.fileId;
    }

    /**
     * Downloads the media.
     *
     * @author Marcos Leandro
     * @since  2023-07-10
     *
     * @param fileId
     */
    private async download(fileId: string): Promise<void> {

        if (this.context.chat.getType() !== "private") {
            this.context.message.delete();
        }

        this.message = await this.createMessage();
        this.fileData = await this.context.message.getFileData(fileId);

        if (!this.fileData || !this.fileData.result) {
            this.message!.edit("❌ An error occurred while downloading your image. 😢");
            return;
        }

        const fileRequest = await fetch(this.fileData.result.fileUrl);
        const file = await fileRequest.blob();
        const destination = PathHelper.getBasePath(`/tmp/${this.context.user.getId()}/${this.fileData.result.filePath}`);

        const directory = path.dirname(destination);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const writeStream = fs.createWriteStream(destination, { flags: "w" });

        writeStream.write(buffer);
        writeStream.end(() => {
            this.sendToCatbox(destination);
        });
    }

    /**
     * Creates the "Downloading..." message.
     *
     * @author Marcos Leandro
     * @since  2023-07-10
     */
    private async createMessage(): Promise<any> {

        const content = "⬇️ Downloading your image...";
        if (this.context.chat.getType() === "private") {
            return await this.context.message.reply(content);
        }

        return await this.context.chat.sendMessage(content, { parseMode : "HTML" });
    }

    /**
     * Sends the file to Catbox.moe.
     *
     * @author Marcos Leandro
     * @xince  1.0.0
     *
     * @param {string} filepath
     */
    private async sendToCatbox(filepath: string): Promise<void> {

        this.message?.edit("⬆️ Sending your image to https://catbox.moe ...");

        const filename = path.basename(filepath);
        const buffer = fs.readFileSync(filepath);
        const blob = new Blob([buffer]);
        // const file = await fileFromPath(filepath);
        const user = new CatboxUser();

        user
            .setReqType("fileupload")
            .setFileToUpload(blob, filename);

        const request = await user.post();
        const response = await request.text();
        fs.unlinkSync(filepath);

        if (!response) {
            this.message!.edit("❌ An error occurred while sending your image to catbox.moe. 😢");
            return;
        }

        if (this.context.chat.getType() === "private") {
            this.sendPrivateMessage(response);
            return;
        }

        this.sendGroupMessage(response);

        // if (response) {

        //     const filesize = this.getParsedSize(file.size);

        //     let message = "";

        //     if (Number(payload.message.chat.id) > 0) {
        //         message += `✅ <b>Uploaded Successfully!</b>\n\n`;
        //         message += `☁️ Service: Catbox\n`;
        //         message += `🗂️ Size: ${filesize}\n`;
        //         message += `⏲️ Expires within: ∞\n`;
        //         message += `📎 Link: <code>${response}</code>\n\n`;
        //         message += `Tap or click on the link 👆 to copy it to your clipboard.\n\n`;
        //         message += `⚡ Stay tuned at <a href="https://github.com/Desenvolvimento-de-Software/moe_catbot">GitHub</a>`;

        //     } else {

        //         const userId = payload.message.from.id;
        //         const username = (payload.message.from.first_name || payload.message.from.username);

        //         message += `${response}\n\n`;

        //         if (payload.message.caption) {
        //             message += `${payload.message.caption}\n\n`;
        //         }

        //         message += `👤 From <a href=\"tg://user?id=${userId}\">${username}</a>\n`;
        //         message += `🤖 By @moe_catbot`;
        //     }

        //     editMessageText
        //         .setChatId(payload.message.chat.id)
        //         .setMessageId(this.messageId || 0)
        //         .setText(message)
        //         .setParseMode("HTML")
        //         .setDisableWebPagePreview(Number(payload.message.chat.id) > 0)
        //         .post();
        // }
    }

    /**
     * Sends the private message.
     *
     * @author Marcos Leandro
     * @since  2023-07-12
     *
     * @param {string} response
     */
    private async sendPrivateMessage(response: string): Promise<void> {

        const filesize = this.getParsedSize(this.fileData!.result.fileSize);
        let message = "";

        message += `${response}\n\n`;
        message += `✅ <b>Uploaded Successfully!</b>\n\n`;
        message += `☁️ Service: Catbox\n`;
        message += `🗂️ Size: ${filesize}\n`;
        message += `⏲️ Expires within: ∞\n`;
        message += `📎 Link: <code>${response}</code>\n\n`;
        message += `Tap or click on the link 👆 to copy it to your clipboard.\n\n`;
        message += `⚡ Stay tuned at <a href="https://github.com/Desenvolvimento-de-Software/moe_catbot">GitHub</a>`;

        this.message?.edit(message, { parseMode : "HTML" });
    }

    /**
     * Sends the group message.
     *
     * @author Marcos Leandro
     * @since  2023-07-12
     *
     * @param {string} response
     */
    private async sendGroupMessage(response: string): Promise<void> {

        let message = "";

        message += `${response}\n\n`;
        if (this.context.message.getCaption()) {
            message += `${this.context.message.getCaption()}\n\n`;
        }

        const username = (this.context.user.getFirstName() || this.context.user.getUsername());
        message += `👤 From <a href=\"tg://user?id=${this.context.user.getId()}\">${username}</a>\n`;
        message += `🤖 By @moe_catbot`;

        const deleteButton: InlineKeyboardButton = {
            text: "Delete (author or admins)",
            callbackData: JSON.stringify({
                callback: "deleteMessage",
                data: {
                    userId: this.context.user.getId()
                }
            })
        };

        const markup: InlineKeyboardMarkup = {
            inlineKeyboard: [[deleteButton]]
        };

        this.message?.edit(message, { parseMode : "HTML", replyMarkup: markup });
    }

    /**
     * Returns the parsed filesize.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param size Raw filesize.
     *
     * @return Parsed filesize.
     */
    private getParsedSize(size: number): string {

        if (typeof size === "undefined") {
            return "∞";
        }

        const steps = ["B", "KB", "MB", "GB"];
        let i = 0;

        while (size > 1024) {
            size /= 1024;
            i++;
        }

        if (typeof steps[i] === "undefined") {
            return "∞";
        }

        return size.toFixed(2) + " " + steps[i];
    }
}
