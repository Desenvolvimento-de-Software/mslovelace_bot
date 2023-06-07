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
import Context from "src/library/telegram/context/Context";
import Lang from "src/helper/Lang";
import Shield from "src/model/Shield";
import Check from "../library/combot/resource/Check";
import RelUsersChats from "src/model/RelUsersChats";
import UserHelper from "src/helper/User";
import ChatHelper from "src/helper/Chat";

export default class AdaShield extends Action {

    /**
     * Ban message.
     *
     * @author Marcos Leandro
     * @since  2023-06-06
     *
     * @var string
     */
    private banMessage: string = "adaShield";

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

        if (!this.context.newChatMember) {
            return;
        }

        const userId = this.context.newChatMember!.getId();

        if (!await this.adaShield(userId) && !await this.cas(userId)) {
            return;
        }

        this.context.newChatMember!.ban();

        const username = (
            this.context.newChatMember!.getFirstName() ||
            this.context.newChatMember!.getUsername()
        );

        const lang = Lang.get(this.banMessage)
            .replace("{userid}", userId)
            .replace("{username}", username);

        this.context.chat.sendMessage(lang);
        await this.updateRelationship();
    }

    /**
     * Executes the AdaShield to see if the user is a registered spammer.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     * @param userId
     *
     * @return
     */
    private async adaShield(userId: number): Promise<boolean> {

        const shield = new Shield();
        shield
            .select(["telegram_user_id"])
            .where("telegram_user_id")
            .equal(userId);

        const result = await shield.execute();
        return !!result.length;
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
    private async cas(userId: number): Promise<boolean> {

        const casCheck = new Check(userId);
        const response = await casCheck.get();
        const json = await response.json();

        const result = (!!json?.ok) || false;
        if (!result) {
            return false;
        }

        const shield = new Shield();
        shield
            .insert()
            .set("telegram_user_id", userId)
            .set("date", Math.floor(Date.now() / 1000))
            .set("reason", "CAS");

        shield.execute();

        this.banMessage = "casMessage";
        return true;
    }

    /**
     * Updates the relationship between the user and the chat.
     *
     * @author Marcos Leandro
     * @since  2022-09-09
     *
     * @return {Promise<void>}
     */
    private async updateRelationship(): Promise<void> {

        const user = await UserHelper.getUserByTelegramId(this.context.newChatMember!.getId());
        const chat = await ChatHelper.getChatByTelegramId(this.context.chat.getId());
        const relUserChat = new RelUsersChats();
        relUserChat
            .update()
            .set("joined", 0)
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        return relUserChat.execute();
    }
}
