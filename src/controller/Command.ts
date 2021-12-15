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

import DefaultController from "./Controller.js";
import GetChatAdministrators from "../library/telegram/resource/GetChatAdministrators.js";
import SendMessage from "../library/telegram/resource/SendMessage.js";
import Lang from "../helper/Lang.js";

export default class Command extends DefaultController {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @siunce  1.0.0
     */
    public constructor() {
        super();
    }

    /**
     * Verifies if the user is one of the chat admins.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {number}  chatId
     * @param  {boolean} report
     *
     * @return {boolean}
     */
    protected async isAdmin(payload: Record<string, any>, report?: boolean): Promise<boolean> {

        if (payload.message.chat.type === "private") {
            return true;
        }

        const request = new GetChatAdministrators();
        request.setChatId(payload.message.chat.id);

        const response = await request.post();
        const json = await response.json();

        if (!json.hasOwnProperty("ok") || json.ok !== true) {
            return false;
        }

        let admins = [];
        for (let i = 0, length = json.result.length; i < length; i++) {
            admins.push(json.result[i].user.id);
        }

        if (!admins.includes(payload.message.from.id) && report === true) {
            this.warnUserAboutReporting(payload);
            this.reportUnauthorizedCommand(payload, json.result);
        }

        return admins.includes(payload.message.from.id);
    }

    /**
     * Warns the user about reporting.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {Record<string, any>} payload
     */
    protected warnUserAboutReporting(payload: Record<string, any>): void {

        const username = payload.message.from.first_name.length ?
            payload.message.from.first_name :
            payload.message.from.username;

        const text = Lang.get("unauthorizedCommand")
            .replace("{userid}", payload.message.from.id)
            .replace("{username}", username);

        const sendMessage = new SendMessage();
        sendMessage
            .setChatId(payload.message.chat.id)
            .setText(text)
            .setParseMode("HTML")
            .post();
    }

    /**
     * Reports the unauthorized command.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param  {Record<string, any>} payload
     * @param  {Array<number>}      admins
     */
    protected async reportUnauthorizedCommand(payload: Record<string, any>, admins: Array<any>): Promise<void> {

        const username = payload.message.from.first_name.length ?
            payload.message.from.first_name :
            payload.message.from.username;

        const groupKey =  payload.message.chat.username ?
            "{chatname}" :
            "<a href=\"https://t.me/{chaturl}\">{chatname}</a>";

        const text = Lang.get("unauthorizedCommandReport")
            .replaceAll("{userid}", payload.message.from.id)
            .replaceAll("{username}", username)
            .replaceAll(groupKey, payload.message.chat.title)
            .replaceAll("{chaturl}", payload.message.chat.username)
            .replaceAll("{content}", payload.message.text);

        for (let i = 0, length = admins.length; i < length; i++) {

            if (admins[i].is_bot) {
                continue;
            }

            const sendMessage = new SendMessage();
            sendMessage
                .setChatId(admins[i].user.id)
                .setText(text)
                .setParseMode("HTML")
                .post();
        }
    }
}
