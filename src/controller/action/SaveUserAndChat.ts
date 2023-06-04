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

import Context from "../../library/Context.js";

export default class saveUserAndChat {

    /**
     * Bot context.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     */
    private context: Context;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-02
     *
     * @param context
     */
    constructor(context: Context) {
        this.context = context;
    }

    /**
     * Saves the user and group.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param payload
     */
    // protected async saveUserAndChat(userObject: Record<string, any>, chatObject: Record<string, any>): Promise<any> {

    //     const user = await UserHelper.getUserByTelegramId(userObject.id);
    //     const userId = user === null ? await UserHelper.createUser(userObject) : user.id;

    //     const chat = await ChatHelper.getChatByTelegramId(chatObject.id);
    //     const chatId = chat === null ? await ChatHelper.createChat(chatObject) : chat.id;

    //     UserHelper.updateUser(userObject);
    //     ChatHelper.updateChat(chatObject);

    //     if (user && chat) {
    //         this.warnNamechanging(user, userObject, chat);
    //     }

    //     if (userId && chatId) {

    //         let relUserChat;

    //         relUserChat = new RelUsersChats();
    //         relUserChat
    //             .select()
    //             .where("user_id").equal(userId)
    //             .and("chat_id").equal(chatId)
    //             .offset(0)
    //             .limit(1);

    //         const row = await relUserChat.execute();
    //         if (row.length) {
    //             relUserChat = new RelUsersChats();
    //             relUserChat
    //                 .update()
    //                 .set("joined", 1)
    //                 .set("checked", 0)
    //                 .where("user_id").equal(userId)
    //                 .and("chat_id").equal(chatId);

    //             relUserChat.execute();
    //             return;
    //         }

    //         relUserChat = new RelUsersChats();
    //         relUserChat
    //             .insert()
    //             .set("user_id", userId)
    //             .set("chat_id", chatId)
    //             .set("date", Math.floor(Date.now() / 1000));

    //         relUserChat.execute();
    //     }
    // }
}
