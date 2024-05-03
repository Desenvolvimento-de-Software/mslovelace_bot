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

import Federation from "./Federation.js";
import Chats from "../../model/Chats.js";
import Context from "../../library/telegram/context/Context.js";
import BotCommand from "../library/telegram/type/BotCommand.js";
import FederationsHelper from "../../helper/Federation.js";
import Lang from "../../helper/Lang.js";
import Log from "../../helper/Log.js";

export default class Group extends Federation {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public static readonly commands: BotCommand[] = [
        { command: "fjoin", description: "Joins a federation." },
        { command: "fleave", description: "Leaves a federation." }
    ];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
    }

    /**
     * Joins a federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async join(): Promise<void> {

        if (this.context.chat.getType() === "private") {
            this.context.message.reply(Lang.get("federationCommandOnlyGroupError"));
            return;
        }

        if (!await this.context.user.isAdmin()) {
            this.context.message.reply(Lang.get("federationJoinOnlyAdminError"));
            return;
        }

        const params = this.command?.getParams() || [];
        if (!params.length) {
            this.context.message.reply(Lang.get("federationJoinNoHashError"));
            return;
        }

        const hash = params[0].trim();
        const federation = await FederationsHelper.getByHash(hash);

        if (!federation) {
            this.context.message.reply(Lang.get("federationInvalidHashError"));
            return;
        }

        if (this.chat?.federation_id?.length) {
            this.context.message.reply(Lang.get("federationJoinHasFederationError"));
            return;
        }

        if (this.chat?.federation_id === federation.id) {
            this.context.message.reply(Lang.get("federationJoinAlreadyJoinedError"));
            return;
        }

        const chat = new Chats();
        chat
            .update()
            .set("federation_id", federation.id)
            .where("id").equal(this.chat!.id);

        try {

            chat.execute();
            const message = Lang.get("federationJoinSuccess")
                .replace("{federation}", federation.description);

            this.context.message.reply(message);

        } catch (err: any) {
            this.context.message.reply(Lang.get("federationJoinError"));
            Log.error(err.toString());
            return;
        }
    }

    /**
     * Leaves a federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async leave(): Promise<void> {

        if (this.context.chat.getType() === "private") {
            this.context.message.reply(Lang.get("federationCommandOnlyGroupError"));
            return;
        }

        if (!await this.context.user.isAdmin()) {
            this.context.message.reply(Lang.get("federationJoinOnlyAdminError"));
            return;
        }

        if (!this.chat?.federation_id) {
            this.context.message.reply(Lang.get("federationLeaveNoFederationError"));
            return;
        }

        const chat = new Chats();
        chat
            .update()
            .set("federation_id", null)
            .where("id").equal(this.chat!.id);

        try {

            chat.execute();
            this.context.message.reply(Lang.get("federationLeaveSuccess"));

        } catch (err: any) {
            this.context.message.reply(Lang.get("federationLeaveError"));
            Log.error(err.toString());
            return;
        }
    }
}
