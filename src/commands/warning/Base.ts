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

import Command from "../Command";
import User from "contexts/User";
import ChatConfigs from "models/ChatConfigs";
import WarningsModel from "models/Warnings";
import UserHelper from "helpers/User";
import Lang from "helpers/Lang";
import { InlineKeyboardButton } from "libraries/telegram/types/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "libraries/telegram/types/InlineKeyboardMarkup";
import { ChatConfigs as ChatConfigsType } from "models/type/ChatConfigs";

export default class Base extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     */
    public constructor() {
        super();
    }

    /**
     * Returns the group's warning limits.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param chat
     *
     * @return Warning limit.
     */
    protected async getWarningLimit(chat: Record<string, any>): Promise<number> {

        const chatConfigs = new ChatConfigs();
        chatConfigs
            .select()
            .where("chat_id").equal(chat.id);

        const chatConfig = await chatConfigs.execute<ChatConfigsType[]>();
        const warningLimit = chatConfig[0].warnings;

        return warningLimit ?? 3;
    }

    /**
     * Returns the user's warnings.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param user
     * @param chat
     *
     * @return Warnings length.
     */
    protected async getWarnings(contextUser: User, chat: Record<string, any>): Promise<Record<string, any>[]> {

        const user = await UserHelper.getByTelegramId(contextUser.getId());

        if (!user || !chat) {
            return Promise.resolve([]);
        }

        const warnings = new WarningsModel();
        warnings
            .select()
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id)
            .and("status").equal(1)
            .orderBy("date", "ASC");

        return await warnings.execute();
    }

    /**
     * Returns the warning message.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param contextUser
     * @param warnings
     * @param warningsLimit
     *
     * @return Warning message.
     */
    protected async getWarningMessage(contextUser: User, warnings: Record<string, any>[], warningsLimit: number): Promise<string> {

        const username = contextUser.getFirstName() ?? contextUser.getUsername();

        let langIndex = warnings.length === 1 ? "warningSigleMessage" : "warningPluralMessage";
        langIndex = warnings.length >= warningsLimit ? "warningBanMessage" : langIndex;
        langIndex = warnings.length === 0 ? "warningNoneMessage" : langIndex;

        let message = Lang.get(langIndex)
            .replace("{userid}", contextUser.getId())
            .replace("{username}", username)
            .replace("{warnings}", warnings.length.toString() + "/" + warningsLimit.toString());

        for (let i = 0, length = warnings.length; i < length; i++) {
            message += ` • ${warnings[i].reason}\n`;
        }

        return Promise.resolve(message);
    }

    /**
     * Sends the warning messages.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param users
     * @param chat
     *
     * @return
     */
    protected async sendWarningMessages(users: User[], chat: Record<string, any>): Promise<void> {

        Lang.set(chat.language || "en");

        const warnings = await this.getWarnings(users[0], chat);
        const warningLimit = await this.getWarningLimit(chat);
        const messages = [];

        for (let i = 0, length = users.length; i < length; i++) {
            const contextUser = users[i];
            messages.push(await this.getWarningMessage(contextUser, warnings, warningLimit));
        }

        if (!messages.length) {
            return Promise.resolve();
        }

        const message = messages.join("\n-----\n");
        const options = this.getMessageOptions(users, warnings);

        await this.context?.getChat()?.sendMessage(message, options);
    }

    /**
     * Returns the message options.
     *
     * @author Marcos Leandro
     * @since  2024-04-22
     *
     * @param users
     * @param chat
     *
     * @returns
     */
    private getMessageOptions(users: User[], warnings: Record<string, any>[]): Record<string, any> {

        const options: Record<string, any> = {
            parse_mode: "HTML"
        };

        if (users.length !== 1) {
            return options;
        }

        if (!warnings.length) {
            return options;
        }

        const lastWarning: Record<string, any> = warnings.at(-1)!;
        const lastWarningRemowalButton: InlineKeyboardButton = {
            text: Lang.get("lastWarningRemovalButton"),
            callback_data: JSON.stringify({
                c: "warning",
                d: `${users[0].getId()},${this.context?.getChat()?.getId()},${lastWarning.id}`
            })
        };

        const allWarningsRemowalButton: InlineKeyboardButton = {
            text: Lang.get("warningsRemovalButton"),
            callback_data: JSON.stringify({
                c: "warning",
                d: `${users[0].getId()},${this.context?.getChat()?.getId()}`
            })
        };

        const markup: InlineKeyboardMarkup = {
            inline_keyboard: [[lastWarningRemowalButton], [allWarningsRemowalButton]]
        };

        options.replyMarkup = markup;
        return options;
    }
}
