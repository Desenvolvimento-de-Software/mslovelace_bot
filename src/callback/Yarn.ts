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

// import AnswerCallbackQuery from "../library/telegram/resource/AnswerCallbackQuery";
// import App from "../App";
// import Callback from "./Callback";
// import YarnCommand from "../command/Yarn";

// export default class Yarn extends Callback {

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
//      * @param data
//      */
//      public async run(payload: Record<string, any>, data: Record<string, any>): Promise<void> {

//         const answer = new AnswerCallbackQuery();
//         answer.setCallbackQueryId(payload.callback_query.id);

//         try {

//             if (data.package) {
//                 const yarnCommand = new YarnCommand(this.app);
//                 await yarnCommand.getPackage(payload.callback_query, data.package);
//                 answer.setText(data.package.toUpperCase());
//             }

//         } catch (err: any) {
//             this.app.log(err.toString());
//         }

//         answer.post();
//     }
// }
