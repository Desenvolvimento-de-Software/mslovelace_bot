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
import Context from "contexts/Context";
import CommandContext from "contexts/Command";
import Lang from "helpers/Lang";
import Log from "helpers/Log";
import { BotCommand } from "libraries/telegram/types/BotCommand";
import { getChatByTelegramId } from "services/Chats";
import { getUserByTelegramId } from "services/Users";
import { PrismaClient } from "@prisma/client";
import {
    createFederation,
    getFederationByHash,
    getFederationsByUser,
    getFederationWithChatsById
} from "services/Federations";

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

        if (!this.context.getUser()?.getId() || !this.context.getChat()?.getId()) {
            return Promise.resolve();
        }

        this.user = await getUserByTelegramId(this.context.getUser()!.getId()) ?? undefined;
        this.chat = await getChatByTelegramId(this.context.getChat()!.getId()) ?? undefined;
        if (!this.user?.id || !this.chat?.id) {
            return Promise.resolve();
        }

        Lang.set(this.chat.language || "en");

        const methods: Record<string, CallableFunction> = {
            fcreate: this.create,
            flist: this.list,
            fdelete: this.delete
        };

        this.command = command;
        const method = this.command.getCommand();
        if (method in methods) {
            await methods[method]();
        }
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

        try {

            const result = await createFederation(this.user!.id, description);
            if (!result) {
                this.context?.getMessage()?.reply(Lang.get("federationCreateError"));
                return Promise.resolve();
            }

            const message = Lang.get("federationCreateSuccess")
                .replace(/{name}/g, description.length ? description : result.hash)
                .replace(/{hash}/g, result.hash);

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

        const federations = await getFederationsByUser(this.context.getUser()!);
        if (!federations?.length) {
            this.context?.getMessage()?.reply(Lang.get("federationListEmpty"));
            return Promise.resolve();
        }

        let message = Lang.get("federationListHeader");
        for (const federation of federations) {

            const federationWithChats = await getFederationWithChatsById(federation.id);

            message += Lang.get("federationListRow")
                .replace("{hash}", federation.hash)
                .replace("{description}", federation.description ?? "")
                .replace("{groups}", federationWithChats?.chats.length.toString() ?? "0");
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
        const federation = await getFederationByHash(hash);
        if (!federation) {
            this.context?.getMessage()?.reply(Lang.get("federationInvalidHashError"));
            return Promise.resolve();
        }

        if (federation.user_id !== this.user!.id) {
            this.context?.getMessage()?.reply(Lang.get("federationNotOwnerError"));
            return Promise.resolve();
        }

        const federationWithChats = await getFederationWithChatsById(federation.id);
        if (federationWithChats?.chats.length === 0 || (!!params[1] && params[1] === "force")) {
            await this.deleteFederation(federation.id);
            return Promise.resolve();
        }

        const message = Lang.get("federationDeleteConfirm")
            .replace("{name}", federation.description ?? "")
            .replace("{hash}", federation.hash)
            .replace("{groups}", federationWithChats?.chats?.length.toString() ?? "0");

        this.context?.getMessage()?.reply(message, { parse_mode : "HTML" });
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

        const prisma = new PrismaClient();

        try {

            await prisma.chats.updateMany({
                where: { federation_id: federationId },
                data: { federation_id: null }

            }).catch((err: any) => {
                prisma.$disconnect();
                throw err;
            });

            await prisma.federations.delete({
                where: { id: federationId }

            }).catch((err: any) => {
                prisma.$disconnect();
                throw err;
            });

        } catch (err: any) {
            this.context?.getMessage()?.reply(Lang.get("federationDeleteError"));
            Log.save(err.toString());
            return Promise.resolve();
        }

        this.context?.getMessage()?.reply(Lang.get("federationDeleteSuccess"));
    }
}
