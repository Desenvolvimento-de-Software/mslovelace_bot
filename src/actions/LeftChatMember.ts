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

import Action from "./Action";
import Context from "contexts/Context";
import Log from "helpers/Log";
import { getChatByTelegramId } from "services/Chats";
import { getUserByTelegramId } from "services/Users";
import { leave } from "services/UsersAndChats";

export default class LeftChatMember extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-05
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Action routines.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
    public async run(): Promise<void> {

        if (!this.context.getLeftChatMember()) {
            return Promise.resolve();
        }

        const userId = this.context.getLeftChatMember()?.getId();
        const chatId = this.context.getChat()?.getId();
        if (!userId || !chatId) {
            return Promise.resolve();
        }

        const user = await getUserByTelegramId(userId);
        const chat = await getChatByTelegramId(chatId);
        if (!user || !chat) {
            return Promise.resolve();
        }

        await leave(user.id, chat.id).catch((err) => {
            Log.save(err.message, err.stack);
        });

        if (!chat.chat_configs.remove_event_messages) {
            return Promise.resolve();
        }

        this.context.getMessage()?.delete();
    }
 }
