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
import BanChatMember from "../../library/telegram/resource/BanChatMember.js";

export default class Ban extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     */
    public constructor(app: App) {
        super(app);
    }

    /**
     * Command main route.
     *
     * @author Marcos Leandro
     * @since 1.0.0
     *
     * @param payload
     */
    public async index(payload: Record<string, any>): Promise<void> {

        if (!await this.isAdmin(payload)) {
            this.warnUserAboutReporting(payload);
            return;
        }

        const userId = await this.getUserId(payload);
        const chatId = payload.message.chat.id;

        if (!userId || !chatId) {
            return;
        }

        const ban = new BanChatMember();
        ban.setUserId(userId).setChatId(chatId).post();
    }
}
