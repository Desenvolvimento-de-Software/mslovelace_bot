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

import Text from "helpers/Text";
import User from "contexts/User";
import { getUserByTelegramId } from "./Users";
import { PrismaClient, federations, rel_users_federations } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Returns a federation by it's ID.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param id
 *
 * @return Federation row.
 */
export async function getFederationById(id: number): Promise<federations|null> {
    return await get({ id: id });
}

/**
 * Returns a federation by it's hash.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param hash
 *
 * @return Federation row.
 */
export async function getFederationByHash(hash: string): Promise<federations|null> {
    return await get({ hash: hash });
}

/**
 * Returns the federations by user.
 *
 * @author Marcos Leandro
 * @since 2025-03-07
 *
 * @param userContext
 *
 * @return Federation rows.
 */
export async function getFederationsByUser(userContext: User): Promise<federations[]|null> {

    const user = await getUserByTelegramId(userContext.getId());
    const result = await prisma.federations.findMany({
        where: {
            user_id: user!.id
        }
    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return result ?? null;
}

/**
 * Returs the federation with it's chats.
 *
 * @author Marcos Leandro
 * @since 2025-03-07
 *
 * @param federationId
 *
 * @return Federation row.
 */
export async function getFederationWithChatsById(federationId: number) {
    const result = await prisma.federations.findUnique({
        where: { id: federationId },
        include: {
            chats: true
        }

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return result ?? null;
}

/**
 * Returns the federation users.
 *
 * @author Marcos Leandro
 * @since 2025-03-08
 *
 * @param federation
 *
 * @return Federation users.
 */
export async function getFederationUsers(federation: federations): Promise<rel_users_federations[]|null> {

    const result = await prisma.rel_users_federations.findMany({
        where: { federation_id: federation.id },

    }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return result ?? null;
}

/**
 * Creates a federation.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param data
 *
 * @returns
 */
export async function createFederation(userId: number, description?: string): Promise<federations|null> {

    const hash = await generateFederationHash();
    const data = {
        user_id: userId,
        hash: hash,
        description: description?.length ? description : null
    };

    const federation = await prisma.federations.create({ data: data }).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(() => {
        prisma.$disconnect();
    });

    return federation ?? null;
}

/**
 * Returns whether the user is an admin of the federation.
 *
 * @author Marcos Leandro
 * @since  2025-03-08
 *
 * @param userId
 * @param federation
 *
 * @return true if the user is an admin of the federation, false otherwise.
 */
export async function isUserFederationAdmin(userId: number, federation: federations): Promise<boolean> {

    const user = await getUserByTelegramId(userId);
    if (!user) {
        return false;
    }

    if (federation.user_id === user.id) {
        return true;
    }

    const federationUsers = await getFederationUsers(federation);
    if (!federationUsers) {
        return false;
    }

    return !!federationUsers.find((federationUser) => (
        federationUser.user_id === user.id
    ));
}

/**
 * Queries the database for a federation.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @param where
 *
 * @return Federation row.
 */
async function get(where: Parameters<typeof prisma.federations.findUnique>[0]['where']): Promise<federations|null> {

    const result = await prisma.federations.findUnique(
        { where: where }

    ).then(async (response) => {
        return response;

    }).catch(async (e: Error) => {
        throw e;

    }).finally(async () => {
        prisma.$disconnect();
    });

    return result ?? null;
}

/**
 * Returns the federation hash.
 *
 * @author Marcos Leandro
 * @since  2025-03-07
 *
 * @returns {string}
 */
async function generateFederationHash(): Promise<string> {

    let federationHash: string;
    let federationHashExists: boolean;

    do {

        federationHash = Text.generateRandomString(32);
        const federation = await getFederationByHash(federationHash);
        federationHashExists = !!federation;

    } while (federationHashExists);

    return federationHash;
}
