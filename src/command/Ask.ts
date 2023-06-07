// /**
//  * Ada Lovelace Telegram Bot
//  *
//  * This file is part of Ada Lovelace Telegram Bot.
//  * You are free to modify and share this project or its files.
//  *
//  * @package  mslovelace_bot
//  * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
//  * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
//  */

// import App from "../App";
// import Command from "./Command";
// import SendMessage from "../library/telegram/resource/SendMessage";
// import BanChatMember from "../library/telegram/resource/BanChatMember";
// import ChatHelper from "../helper/Chat";
// import Lang from "../helper/Lang";

// export default class Ask extends Command {

//     /**
//      * The constructor.
//      *
//      * @author Marcos Leandro
//      * @since  2022-09-12
//      *
//      * @param app App instance.
//      */
//     public constructor(app: App) {
//         super(app);
//     }

//     /**
//      * Ask-to-ask main route.
//      *
//      * @author Marcos Leandro
//      * @since 1.0.0
//      */
//     public async index(payload: Record<string, any>): Promise<void> {

//         const isAdmin = await this.isAdmin(payload);
//         if (!isAdmin) {
//             return;
//         }

//         const sendMessage = new SendMessage();
//         sendMessage
//             .setChatId(payload.message.chat.id)
//             .setText(Lang.get("askToAskLink"));

//         if (payload.message?.reply_to_message?.message_id) {
//             sendMessage.setReplyToMessageId(payload.message.reply_to_message.message_id);
//         }

//         sendMessage.post();
//     }
// }
