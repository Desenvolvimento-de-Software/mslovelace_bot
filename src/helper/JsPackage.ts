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

import Lang from "./Lang.js";

export default class JsPackage {

    /**
     * Loaded package.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    protected package: Record<string, any> = {};

    /**
     * Message array from loaded package.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    protected message: Array<string> = [];

    /**
     * The constructor.
     * 
     * @author Marcos Leandro
     * @since  2022-10-11
     * 
     * @param  record
     */
    public constructor(record: Record<string, any>) {
        this.package = record;
    }

    /**
     * Returns the resulting package message.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    public getMessage(): string {
        return this.message.join("\n");
    }

    /**
     * Formats the person.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     *
     * @param person
     *
     * @return string
     */
     protected formatPerson(person: Record<string, string>): string {
        const name = person.name || person.username || "Unknown";
        const email = person.email || null;
        return email ? `<a href="mailto:${email}">${name}</a>` : name;
    }
}
