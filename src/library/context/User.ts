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

import BanChatMember from "../telegram/resource/BanChatMember.js";
import UnbanChatMember from "../telegram/resource/UnbanChatMember.js";
import { Message as MessageType } from "../telegram/type/Message.js";

export default class User {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    context: MessageType;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param context
     */
    public constructor(context: MessageType) {
        this.context = context;
    }

    /**
     * Bans the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param  untilDate
     */
    public async ban(untilDate?: number): Promise<Record<string, any>> {

        // if (!await this.isAdmin(payload)) {
        //     this.warnUserAboutReporting(payload);
        //     return;
        // }

        const ban = new BanChatMember();
        ban
            .setUserId(this.context!.from!.id!)
            .setChatId(this.context!.chat!.id!);

        if (untilDate) {
            ban.setUntilDate(untilDate);
        }

        return ban.post();
    }

    /**
     * Unbans the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param  onlyIfBanned
     */
    public async unban(onlyIfBanned?: boolean): Promise<Record<string, any>> {

        // if (!await this.isAdmin(payload)) {
        //     this.warnUserAboutReporting(payload);
        //     return;
        // }

        const unban = new UnbanChatMember();
        unban
            .setUserId(this.context!.from!.id!)
            .setChatId(this.context!.chat!.id!);

        if (onlyIfBanned) {
            unban.setOnlyIfBanned(false);
        }

        return unban.post();
    }

    /**
     * Kicks the user.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    public async kick(): Promise<Record<string, any>> {
        return this.unban(false);
    }
}
