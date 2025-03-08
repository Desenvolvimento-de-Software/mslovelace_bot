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
import Context from "contexts/Context";
import CommandContext from "contexts/Command";
import Lang from "helpers/Lang";
import { Chat as Chatype } from "libraries/telegram/types/Chat";
import { ChatWithConfigs } from "types/ChatWithConfigs";
import { getChatByTelegramId } from "services/Chats";
import { getUserByTelegramId } from "services/Users";
import { getFederationWithChatsById } from "services/Federations";
import { Message as MessageType } from "libraries/telegram/types/Message";
import { User as UserType } from "libraries/telegram/types/User";
import { Update as UpdateType } from "libraries/telegram/types/Update";
import { FederationsWithChats } from "types/FederationsWithChats";
import { users } from "@prisma/client";

export default class Federation extends Command {

    /**
     * User object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected user?: users;

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected chat?: ChatWithConfigs;

    /**
     * Federation object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected federation?: FederationsWithChats;

    /**
     * Command context.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     */
    protected command?: CommandContext;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    public constructor() {
        super();
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param command
     * @param context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;

        const userId = this.context?.getUser()?.getId();
        const chatId = this.context?.getChat()?.getId();
        if (!userId || !chatId) {
            return Promise.resolve();
        }

        this.user = await getUserByTelegramId(userId) ?? undefined;
        this.chat = await getChatByTelegramId(chatId) ?? undefined;

        if (!this.user?.id || !this.chat?.id) {
            return Promise.resolve();
        }

        Lang.set(this.chat.language || "en");

        if (this.chat.federation_id) {
            this.federation = await getFederationWithChatsById(Number(this.chat?.federation_id)) ?? undefined;
        }

        this.command = command;
        const method = this.command.getCommand().substring(1) as keyof Federation;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }
    }

    /**
     * Creates a context.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param user
     * @param chat
     *
     * @return {Context}
     */
    protected getContext(user: Record<string, any>, chat: Record<string, any>): Context {

        const userType: UserType = {
            id: user.user_id,
            is_bot: user.is_bot,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username
        };

        const Chatype: Chatype = {
            id: chat.chat_id,
            type: chat.type,
            title: chat.title,
            username: chat.username,
            first_name: chat.first_name,
            last_name: chat.last_name
        };

        const message: MessageType = {
            message_id: 0,
            from: userType,
            chat: Chatype,
            date: Math.floor(Date.now() / 1000)
        };

        const update: UpdateType = {
            update_id: 0,
            message: message
        };

        return new Context("message", update);
    }
}
