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

import Federation from "./Federation";
import ChatHelper from "helper/Chat";
import Chats from "model/Chats";
import Context from "context/Context";
import CommandContext from "context/Command";
import FederationHelper from "helper/Federation";
import Federations from "model/Federations";
import Lang from "helper/Lang";
import Log from "helper/Log";
import Text from "helper/Text";
import UserHelper from "helper/User";
import { BotCommand } from "library/telegram/type/BotCommand";
import { CountType } from "model/type/Mysql";
import { Federation as FederationType } from "model/type/Federation";

export default class Manage extends Federation {

    /**
     * Commands list.
     *
     * @author Marcos Leandro
     * @since  2024-05-03
     *
     * @var {BotCommand[]}
     */
    public readonly commands: BotCommand[] = [
        { command: "fcreate", description: "Creates a federation." },
        { command: "flist", description: "List your federations." },
        { command: "fdelete", description: "Deletes a federation." }
    ];

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
     */
    public constructor() {
        super();
    }

    /**
     * Runs the command.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     *
     * @param {CommandContext} command
     * @param {Context}        context
     */
    public async run(command: CommandContext, context: Context): Promise<void> {

        this.context = context;
        if (!this.context) {
            return Promise.resolve();
        }

        const userId = this.context.getUser()?.getId();
        const chatId = this.context.getChat()?.getId();
        if (!userId || !chatId) {
            return Promise.resolve();
        }

        this.user = await UserHelper.getByTelegramId(userId);
        this.chat = await ChatHelper.getByTelegramId(chatId);

        if (!this.user?.id || !this.chat?.id) {
            return Promise.resolve();
        }

        Lang.set(this.chat.language || "en");

        this.command = command;
        const method = this.command.getCommand().substring(1) as keyof Federation;
        if (typeof this[method] === "function") {
            await (this[method] as Function).call(this);
        }

        return Promise.resolve();
    }

    /**
     * Creates a new federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async create(): Promise<void> {

        if (this.context?.getChat()?.getType() !== "private") {
            this.context?.getMessage()?.reply(Lang.get("federationCreateOnlyPrivate"));
            return Promise.resolve();
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
                this.context?.getMessage()?.reply(Lang.get("federationCreateError"));
                return Promise.resolve();
            }

            const message = Lang.get("federationCreateSuccess")
                .replace(/{name}/g, description.length ? description : federationHash)
                .replace(/{hash}/g, federationHash);

            this.context?.getMessage()?.reply(message, { parse_mode : "HTML" });

        } catch (err: any) {
            this.context?.getMessage()?.reply(Lang.get("federationCreateError"));
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

        if (this.context?.getChat()?.getType() !== "private") {
            this.context?.getMessage()?.reply(Lang.get("federationCommandOnlyPrivateError"));
            return Promise.resolve();
        }

        const federations = new Federations();
        federations
            .select(["id", "hash", "description"])
            .where("user_id").equal(this.user!.id)
            .orderBy("description", "asc");

        const result = await federations.execute<FederationType[]>();
        if (!result.length) {
            this.context?.getMessage()?.reply(Lang.get("federationListEmpty"));
            return Promise.resolve();
        }

        let message = Lang.get("federationListHeader");
        for (const federation of result) {
            message += Lang.get("federationListRow")
                .replace("{hash}", federation.hash)
                .replace("{description}", federation.description)
                .replace("{groups}", (await this.countGroups(federation.id)).toString());
        }

        this.context?.getMessage()?.reply(message, { parse_mode : "HTML" });
    }

    /**
     * Deletes a federation.
     *
     * @author Marcos Leandro
     * @since  2023-07-04
     */
    private async delete(): Promise<void> {

        if (this.context?.getChat()?.getType() !== "private") {
            this.context?.getMessage()?.reply(Lang.get("federationCommandOnlyPrivateError"));
            return Promise.resolve();
        }

        const params = this.command?.getParams() || [];
        if (!params.length) {
            this.context?.getMessage()?.reply(Lang.get("federationDeleteNoHashError"));
            return Promise.resolve();
        }

        const hash = params[0].trim();
        const federation = await FederationHelper.getByHash(hash);
        if (!federation) {
            this.context?.getMessage()?.reply(Lang.get("federationInvalidHashError"));
            return Promise.resolve();
        }

        if (federation.user_id !== this.user!.id) {
            this.context?.getMessage()?.reply(Lang.get("federationNotOwnerError"));
            return Promise.resolve();
        }

        const groups = await this.countGroups(federation.id);
        if (groups === 0 || (!!params[1] && params[1] === "force")) {
            await this.deleteFederation(federation.id);
            return Promise.resolve();
        }

        const message = Lang.get("federationDeleteConfirm")
            .replace("{name}", federation.description)
            .replace("{hash}", federation.hash)
            .replace("{groups}", groups.toString());

        this.context?.getMessage()?.reply(message, { parse_mode : "HTML" });
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

            const result = await federations.execute<FederationType[]>();
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

            const result = await chats.execute<CountType[]>();
            return result[0].total;

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
            this.context?.getMessage()?.reply(Lang.get("federationDeleteError"));
            Log.error(err.toString(), true);
            return Promise.resolve();
        }

        const federations = new Federations();
        federations
            .delete()
            .where("id").equal(federationId);

        try {
            await federations.execute();
            this.context?.getMessage()?.reply(Lang.get("federationDeleteSuccess"));

        } catch (err: any) {
            this.context?.getMessage()?.reply(Lang.get("federationDeleteError"));
            Log.error(err.toString(), true);
        }
    }
}
