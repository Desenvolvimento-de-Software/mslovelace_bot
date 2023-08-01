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
import ChatHelper from "../../helper/Chat.js";
import Chats from "../../model/Chats.js";
import Context from "../../library/telegram/context/Context.js";
import CommandContext from "../../library/telegram/context/Command.js";
import FederationHelper from "../../helper/Federation.js";
import Federations from "../../model/Federations.js";
import Lang from "../../helper/Lang.js";
import Log from "../../helper/Log.js";
import Text from "../../helper/Text.js";
import UserHelper from "../../helper/User.js";

export default class Manage extends Federation {

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
     *
     * @param app App instance.
     */
    public constructor(context: Context) {
        super(context);
        this.setCommands(["fcreate", "flist", "fdelete"]);
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param command
     */
    public async run(command: CommandContext): Promise<void> {

        this.user = await UserHelper.getByTelegramId(this.context.user.getId());
        this.chat = await ChatHelper.getByTelegramId(this.context.chat.getId());

        if (!this.user?.id || !this.chat?.id) {
            return;
        }

        Lang.set(this.chat!.language || "us");

        this.command = command;
        const action = this.command.getCommand().substring(1);
        this[action as keyof typeof Federation.prototype](true as never);
    }

    /**
     * Creates a new federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async create(): Promise<void> {

        if (this.context.chat.getType() !== "private") {
            this.context.message.reply(Lang.get("federationCreateOnlyPrivate"));
            return;
        }

        const params = this.command?.getParams() || [];
        const description = params.join(" ").trim();

        const federationHash = await this.generateFederationHash();
        const federations = new Federations();
        const insert = federations.insert();

        insert
            .set("user_id", this.user!.id)
            .set("hash", federationHash);

        if (description.length) {
            insert.set("description", description);
        }

        try {

            const result = await federations.execute();
            if (!result) {
                this.context.message.reply(Lang.get("federationCreateError"));
                return;
            }

            const message = Lang.get("federationCreateSuccess")
                .replace(/{name}/g, description.length ? description : federationHash)
                .replace(/{hash}/g, federationHash);

            this.context.message.reply(message, { parseMode: "HTML" });

        } catch (err: any) {
            this.context.message.reply(Lang.get("federationCreateError"));
            Log.error(err.toString());
        }
    }

    /**
     * Lists the user's federations.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async list(): Promise<void> {

        if (this.context.chat.getType() !== "private") {
            this.context.message.reply(Lang.get("federationCommandOnlyPrivateError"));
            return;
        }

        const federations = new Federations();
        federations
            .select(["id", "hash", "description"])
            .where("user_id").equal(this.user!.id)
            .orderBy("description", "asc");

        const result = await federations.execute();
        if (!result.length) {
            this.context.message.reply(Lang.get("federationListEmpty"));
            return;
        }

        let message = Lang.get("federationListHeader");
        for (const federation of result) {
            message += Lang.get("federationListRow")
                .replace("{hash}", federation.hash)
                .replace("{description}", federation.description)
                .replace("{groups}", (await this.countGroups(federation.id)).toString());
        }

        this.context.message.reply(message, { parseMode: "HTML" });
    }

    /**
     * Deletes a federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async delete(): Promise<void> {

        if (this.context.chat.getType() !== "private") {
            this.context.message.reply(Lang.get("federationCommandOnlyPrivateError"));
            return;
        }

        const params = this.command?.getParams() || [];
        if (!params.length) {
            this.context.message.reply(Lang.get("federationDeleteNoHashError"));
            return;
        }

        const hash = params[0].trim();
        const federation = await FederationHelper.getByHash(hash);
        if (!federation) {
            this.context.message.reply(Lang.get("federationInvalidHashError"));
            return;
        }

        if (federation.user_id !== this.user!.id) {
            this.context.message.reply(Lang.get("federationNotOwnerError"));
            return;
        }

        const groups = await this.countGroups(federation.id);
        if (groups === 0 || (!!params[1] && params[1] === "force")) {
            await this.deleteFederation(federation.id);
            return;
        }

        const message = Lang.get("federationDeleteConfirm")
            .replace("{name}", federation.description)
            .replace("{hash}", federation.hash)
            .replace("{groups}", groups.toString());

        this.context.message.reply(message, { parseMode: "HTML" });
    }

    /**
     * Returns the federation hash.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @returns {string}
     */
    private async generateFederationHash(): Promise<string> {

        let federationHash;
        let federationHashExists: boolean;

        do {

            federationHash = Text.generateRandomString(32);

            const federations = new Federations();
            federations
                .select(["id"])
                .where("hash").equal(federationHash)
                .offset(0)
                .limit(1);

            const result = await federations.execute();
            federationHashExists = result.length > 0;

        } while (federationHashExists);

        return federationHash;
    }

    /**
     * Counts the number of groups in a federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param federationId
     *
     * @return {Promise<number>}
     */
    private async countGroups(federationId: number): Promise<number> {

        const chats = new Chats();
        chats
            .select(["count(id) total"])
            .where("federation_id").equal(federationId)
            .offset(0)
            .limit(1);

        try {

            const result = await chats.execute();
            return parseInt(result[0].total);

        } catch (err: any) {
            Log.error(err.toString(), true);
            return 0;
        }
    }

    /**
     * Deletes the federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-02
     *
     * @param {number} federationId
     */
    private async deleteFederation(federationId: number): Promise<void> {

        const chats = new Chats();
        chats
            .update()
            .set("federation_id", null)
            .where("federation_id").equal(federationId);

        try {
            await chats.execute();

        } catch (err: any) {
            this.context.message.reply(Lang.get("federationDeleteError"));
            Log.error(err.toString(), true);
            return;
        }

        const federations = new Federations();
        federations
            .delete()
            .where("id").equal(federationId);

        try {
            await federations.execute();
            this.context.message.reply(Lang.get("federationDeleteSuccess"));

        } catch (err: any) {
            this.context.message.reply(Lang.get("federationDeleteError"));
            Log.error(err.toString(), true);
        }
    }
}
