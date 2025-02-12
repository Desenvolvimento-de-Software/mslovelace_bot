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

import ChatHelper from "../../helper/Chat.js";
import Command from "../Command.js";
import Context from "../../library/telegram/context/Context.js";
import CommandContext from "../../library/telegram/context/Command.js";
import Lang from "../../helper/Lang.js";
import UserHelper from "../../helper/User.js";
import FederationHelper from "../../helper/Federation.js";
import { Context as ContextType } from "../../library/telegram/type/Context.js";
import { Chat as ChatType } from "../../library/telegram/type/Chat.js";
import { User as UserType } from "../../library/telegram/type/User.js";

export default class Federation extends Command {

    /**
     * User object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected user?: Record<string, any>;

    /**
     * Chat object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected chat?: Record<string, any>;

    /**
     * Federation object.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    protected federation?: Record<string, any>;

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
        this.user = await UserHelper.getByTelegramId(this.context.user.getId());
        this.chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        if (!this.user?.id || !this.chat?.id) {
            return;
        }

        Lang.set(this.chat.language || "us");

        if (this.chat.federation_id) {
            this.federation = await FederationHelper.getById(Number(this.chat?.federation_id));
        }

        this.command = command;
        const method = this.command.getCommand().substring(1) as keyof Federation;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }

        return Promise.resolve();
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
     * @return {Message}
     */
    protected getContext(user: Record<string, any>, chat: Record<string, any>): Context {

        const userType: UserType = {
            id: user.user_id,
            is_bot: user.is_bot,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username
        };

        const chatType: ChatType = {
            id: chat.chat_id,
            type: chat.type,
            title: chat.title,
            username: chat.username,
            first_name: chat.first_name,
            last_name: chat.last_name
        };

        const ContextType: ContextType = {
            message_id: 0,
            from: userType,
            chat: chatType,
            date: Math.floor(Date.now() / 1000)
        };

        return new Context({ message: ContextType });
    }
}
