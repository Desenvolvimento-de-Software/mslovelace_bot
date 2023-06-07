// /**
//  * Ada Lovelace Telegram Bot
//  *
//  * This file is part of Ada Lovelace Telegram Bot.
//  * You are free to modify and share this project or its files.
//  *
//  * @package  mslovelace_bot
//  * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
//  * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
//  */

// import App from "../App";
// import Command from "./Command";
// import ChatHelper from "../helper/Chat";
// import YarnPackage from "../helper/YarnPackage";
// import EditMessageText from "../library/telegram/resource/EditMessageText";
// import SendMessage from "../library/telegram/resource/SendMessage";
// import Lang from "../helper/Lang";
// import { exec } from "child_process";

// export default class Yarn extends Command {

//     /**
//      * Telegram peyload.
//      *
//      * @author Marcos Leandro
//      * @since  2022-10-11
//      */
//     private payload: Record<string, any> = {};

//     /**
//      * The constructor.
//      *
//      * @author Marcos Leandro
//      * @since  2022-10-11
//      *
//      * @param app
//      */
//     public constructor(app: App) {
//         super(app);
//     }

//     /**
//      * Command main route.
//      *
//      * @author Marcos Leandro
//      * @since 2022-10-11
//      */
//     public async index(payload: Record<string, any>): Promise<void> {

//         const text = payload.message.text.split(/\s+/);
//         if (!text.length || text.length < 2) {
//             return;
//         }

//         const library = text[1].replace(/[^\w\d_-]/g, '').toLowerCase();
//         if (!library.length) {
//             return;
//         }

//         const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);
//         if (!chat || !chat.id) {
//             return;
//         }

//         Lang.set(chat.language || "us");
//         this.getPackage(payload, library);
//     }

//     /**
//      * Gets the package from yarn.
//      *
//      * @author Marcos Leandro
//      * @since  2022-10-11
//      *
//      * @param library
//      */
//     public async getPackage(payload: Record<string, any>, library: String): Promise<void> {

//         this.payload = payload;

//         try {

//             exec(`yarn info --json ${library}`, (error: any, stdout: string, stderr: string) => {
//                 this.processResponse(error, stdout, stderr);
//             });

//         } catch (err: any) {
//             this.app.log(err.toString());
//         }
//     }

//     /**
//      * Processes the shell response.
//      *
//      * @author Marcos Leandro
//      * @since  2022-10-11
//      *
//      * @param error
//      * @param stdout
//      * @param stderr
//      */
//     private async processResponse(error: any, stdout: string, stderr: string): Promise<void> {

//         if (error) {
//             this.app.log(error.message);
//             return;
//         }

//         if (stderr) {
//             this.app.log(stderr);
//             return;
//         }

//         const library = await JSON.parse(stdout);
//         if (!library) {
//             return;
//         }

//         const yarnPackage = new YarnPackage(library);
//         if (this.payload.data) {
//             return this.updateMessage(yarnPackage);
//         }

//         return this.sendNewMessage(yarnPackage);
//     }

//     /**
//      * Sends a new message.
//      *
//      * @author Marcos Leandro
//      * @since  2022-10-20
//      *
//      * @param yarnPackage
//      */
//     async sendNewMessage(yarnPackage: YarnPackage): Promise<void> {

//         const sendMessage = new SendMessage();
//         sendMessage
//             .setChatId(this.payload.message.chat.id)
//             .setText(yarnPackage.getMessage())
//             .setDisableWebPagePreview(true)
//             .setParseMode("HTML");

//         const dependencies = yarnPackage.getDependencies();
//         if (dependencies) {
//             sendMessage.setReplyMarkup(dependencies);
//         }

//         if (this.payload.message?.reply_to_message?.message_id) {
//             sendMessage.setReplyToMessageId(this.payload.message.reply_to_message.message_id);
//         }

//         sendMessage.post();
//     }

//     /**
//      * Edits the existing message.
//      *
//      * @author Marcos Leandro
//      * @since  2022-10-20
//      *
//      * @param yarnPackage
//      */
//     async updateMessage(yarnPackage: YarnPackage): Promise<void> {

//         const messageId = this.payload.message.message_id;
//         const sendMessage = new EditMessageText();
//         sendMessage
//             .setChatId(this.payload.message.chat.id)
//             .setMessageId(messageId)
//             .setText(yarnPackage.getMessage())
//             .setDisableWebPagePreview(true)
//             .setParseMode("HTML");

//         const dependencies = yarnPackage.getDependencies();
//         if (dependencies) {
//             sendMessage.setReplyMarkup(dependencies);
//         }

//         sendMessage.post();
//     }
// }
