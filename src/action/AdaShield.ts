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
import ChatHelper from "helper/Chat";
import Check from "library/combot/resource/Check";
import Context from "context/Context";
import Lang from "helper/Lang";
import RelUsersChats from "model/RelUsersChats";
import Shield from "model/Shield";
import UserHelper from "helper/User";
import { Shield as ShieldType } from "model/type/Shield";

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

        const userId = newChatMember.getId();
        if (!await this.adaShield(userId) && !await this.cas(userId)) {
            return Promise.resolve();
        }

        newChatMember.ban();

        const username = (newChatMember.getFirstName() ?? newChatMember.getUsername());
        const lang = Lang.get(this.banMessage)
            .replace("{userid}", userId)
            .replace("{username}", username);

        this.context.getChat()?.sendMessage(lang, { parse_mode : "HTML" });
        await this.updateRelationship();

        return Promise.resolve();
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

        const result = await shield.execute<ShieldType[]>();
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

        const newChatMember = this.context.getNewChatMember();
        if (!newChatMember) {
            return Promise.resolve();
        }

        const chatId = this.context.getChat()?.getId();
        if (!chatId) {
            return Promise.resolve();
        }

        const user = await UserHelper.getByTelegramId(newChatMember.getId());
        if (!user) {
            return Promise.resolve();
        }

        const chat = await ChatHelper.getByTelegramId(chatId);
        if (!chat) {
            return Promise.resolve();
        }

        const relUserChat = new RelUsersChats();
        relUserChat
            .update()
            .set("joined", 0)
            .where("user_id").equal(user.id)
            .and("chat_id").equal(chat.id);

        await relUserChat.execute();
        return Promise.resolve();
    }
}
