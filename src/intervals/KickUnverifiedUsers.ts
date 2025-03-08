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

import Context from "contexts/Context";
import Iinterval from "interfaces/Iinterval";
import Log from "helpers/Log";
import { getNonVerifiedUsers } from "services/Users";
import { Message as MessageType } from "libraries/telegram/types/Message";
import ContextFactory from "contexts/ContextFactory";

export default class KickUnverifiedUsers implements Iinterval {

    /**
     * Current interval.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    private interval: NodeJS.Timer | null = null;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    public constructor() {

        const run = () => {
            this.run();
        };

        run();
    }

    /**
     * Destroys the interval.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    public destroy(): void {
        if (this.interval) {
            clearTimeout(this.interval);
        }
    }

    /**
     * Interval routines.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     */
    private readonly run = async (): Promise<void> => {

        try {

            const users = await getNonVerifiedUsers();
            this.processUsers(users);

        } catch (err: any) {
            Log.save(err.message, err.stack)

        } finally {
            this.interval = setTimeout(this.run, 5000);
        }
    }

    /**
     * Processes the users.
     *
     * @author Marcos Leandro
     * @since  2025-03-07
     *
     * @param users
     */
    private readonly processUsers = async (users: MessageType[]): Promise<void> => {

        if (!users.length) {
            return;
        }

        users.forEach(async (message) => {
            const context = ContextFactory.create({ update_id: 0, message: message });
            if (context) {
                await this.kickUser(context);
                await this.unrestrictUser(context);
            }
        });
    }

    /**
     * Kicks the user.
     *
     * @author Marcos Leandro
     * @since  2025-02-25
     *
     * @param context
     */
    private readonly kickUser = async (context: Context): Promise<void> => {
        await context.getUser()!.kick().then();
    };

    /**
     * Unrestricts the user.
     *
     * @param context
     */
    private readonly unrestrictUser = async (context: Context): Promise<void> => {
        await context.getUser()!.unrestrict();
    };
}
