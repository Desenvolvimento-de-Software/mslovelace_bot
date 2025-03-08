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
import Check from "libraries/combot/resources/Check";
import Context from "contexts/Context";
import Lang from "helpers/Lang";
import User from "contexts/User";
import { addUserToShield, getUserByTelegramId } from "services/AdaShield";

export default class AdaShield extends Action {

    /**
     * Ban message.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @var string
     */
    private banMessage: string = "adaShieldMessage";

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     * @param context
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Run the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @returns
     */
    public async run(): Promise<void> {

        const newChatMember = this.context.getNewChatMember();
        if (!newChatMember) {
            return Promise.resolve();
        }

        if (!await getUserByTelegramId(newChatMember.getId()) && !await this.cas(newChatMember)) {
            return Promise.resolve();
        }

        newChatMember.ban();

        const userId = newChatMember.getId();
        const username = (newChatMember.getFirstName() ?? newChatMember.getUsername());
        const lang = Lang.get(this.banMessage)
            .replace(/{userid}/g, userId.toString())
            .replace(/{username}/g, username ?? "");

        this.context.getChat()?.sendMessage(lang, { parse_mode : "HTML" });
    }

    /**
     * Executes the Combot Anti-SPAM (CAS) to see if the user is a registered spammer.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     * @param userId
     *
     * @return
     */
    private async cas(user: User): Promise<boolean> {

        const casCheck = new Check(user.getId());
        const response = await casCheck.get();
        const json = await response.json();

        const result = (!!json?.ok) || false;
        if (!result) {
            return false;
        }

        await addUserToShield(user, "CAS");

        this.banMessage = "casMessage";
        return true;
    }
}
