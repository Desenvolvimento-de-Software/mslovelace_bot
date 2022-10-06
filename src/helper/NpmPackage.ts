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

export default class NpmPackage {

    /**
     * Loaded package.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private package: Record<string, any>;

    /**
     * Message array from loaded package.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private message: Array<string> = [];

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     *
     * @param record
     */
    public constructor(record: Record<string, any>) {
        this.package = record;
        this.addDescription();
        this.addDetails();
        this.addLinks();
        this.addAuthor();
        this.addPublisher();
        this.addMaintainers();
        this.addKeywords();
        this.addFooter();
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
     * Adds the package description.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addDescription() {
        this.message.push(Lang.get("npmPackageDescription").replace("{description}", this.package.description));
        this.message.push("");
    }

    /**
     * Adds the package details.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addDetails() {

        const countBefore = this.message.length;
        for (let detail of ["name", "version", "date"]) {
            const langIndex = "npmPackage" + detail[0].toUpperCase() + detail.substring(1);
            !this.package.hasOwnProperty(detail) || this.message.push(Lang.get(langIndex).replace(`\{${detail}\}`, this.package[detail]));
        }

        this.message.length === countBefore || this.message.push("");
    }

    /**
     * Adds the package links, if it has some.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addLinks() {

        if (!this.package.links) {
            return;
        }

        this.message.push(Lang.get("npmPackageLinks"));

        for (let key in this.package.links) {

            const link = Lang.get("npmPackageLink")
                .replace("{linkname}", key)
                .replace("{linkurl}", this.package.links[key]);

            this.message.push(link);
        }

        this.message.push("");
    }

    /**
     * Adds the package author, if it has one.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addAuthor() {

        if (!this.package.author) {
            return;
        }

        const person = this.formatPerson(this.package.author);
        this.message.push(Lang.get("npmAuthor"));
        this.message.push(Lang.get("npmPerson").replace("{person}", person));
        this.message.push("");
    }

    /**
     * Adds the package publisher, if it has one.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addPublisher() {

        if (!this.package.publisher) {
            return;
        }

        const person = this.formatPerson(this.package.publisher);
        this.message.push(Lang.get("npmPublisher"));
        this.message.push(Lang.get("npmPerson").replace("{person}", person));
        this.message.push("");
    }

    /**
     * Adds the package maintainers, if it has some.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addMaintainers() {

        if (!this.package.maintainers?.length) {
            return;
        }

        this.message.push(Lang.get("npmMaintainers"));
        for (let maintainer of this.package.maintainers) {
            const person = this.formatPerson(maintainer);
            this.message.push(Lang.get("npmPerson").replace("{person}", person));
        }

        this.message.push("");
    }

    /**
     * Adds the package keywords, if it has some.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addKeywords() {

        if (!this.package.keywords?.length) {
            return;
        }

        this.message.push(Lang.get("npmPackageKeywords"));

        let keywords = [];
        for (let keyword of this.package.keywords) {
            keywords.push(`<code>${keyword}</code>`);
        }

        const keywordsString = keywords.join(", ");
        this.message.push(keywordsString);
        this.message.push("");
    }

    /**
     * Adds the package footer.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addFooter() {
        this.message.push(Lang.get("npmPackageInstall").replace("{package}", this.package.name));
        this.message.push("");
        this.message.push(Lang.get("playgroundLink").replace("{package}", this.package.name));
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
     private formatPerson(person: Record<string, string>): string {
        const name = person.name || person.username || "Unknown";
        const email = person.email || null;
        return email ? `<a href="mailto:${email}">${name}</a>` : name;
    }
}
