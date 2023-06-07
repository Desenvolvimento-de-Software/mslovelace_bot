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

import Command from "./Command";
import Context from "../library/telegram/context/Context";
import Message from "src/library/telegram/context/Message";
import User from "src/library/telegram/context/User";
import CommandContext from "../library/telegram/context/Command";

export default class Ban extends Command {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-09-12
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["ban", `ban${process.env.TELEGRAM_USERNAME}`]);
    }

    /**
     * Executes the command.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param command
     *
     * @returns
     */
    public async execute(command: CommandContext): Promise<void> {

        const replyToMessage = this.context.message.getReplyToMessage();
        if (replyToMessage) {
            this.banByReply(replyToMessage);
            return;
        }

        const mentions = this.context.message.getMentions();
        console.log(mentions);
        if (!mentions.length) {
            return;
        }

        for (const mention of mentions) {
            this.banByMention(mention).then((response) => console.log(response));
        }
    }

    /**
     * Bans an user by message reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async banByReply(replyToMessage: Message): Promise<Record<string, any>> {
        return replyToMessage.getUser().ban();
    }

    /**
     * Bans an user by mention reply.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @returns void
     */
    private async banByMention(mention: User): Promise<Record<string, any>> {
        return mention.ban();
    }
}

//     /**
//      * The constructor.
//      *
//      * @author Marcos Leandro
//      * @since 1.0.0
//      */
//     public constructor(app: App) {
//         super(app);
//     }

//     /**
//      * Command main route.
//      *
//      * @author Marcos Leandro
//      * @since 1.0.0
//      *
//      * @param payload
//      */
//     public async index(payload: Record<string, any>): Promise<void> {

//         if (!await this.isAdmin(payload)) {
//             this.warnUserAboutReporting(payload);
//             return;
//         }

//         const userId = await this.getUserId(payload);
//         const chatId = payload.message.chat.id;

//         if (!userId || !chatId) {
//             return;
//         }

//         const ban = new BanChatMember();
//         ban.setUserId(userId).setChatId(chatId).post();
//     }
// }
