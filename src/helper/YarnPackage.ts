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

import JsPackage from "./JsPackage";
import SizeHelper from "./Size";
import Lang from "./Lang";
import { InlineKeyboardButton } from "../library/telegram/type/InlineKeyboardButton";
import { InlineKeyboardMarkup } from "../library/telegram/type/InlineKeyboardMarkup";

export default class YarnPackage extends JsPackage {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @param  record
     */
    public constructor(record: Record<string, any>) {

        super(record);

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
     * Returns the package dependencies.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     *
     * @return Markup buttons.
     */
    public getDependencies(): InlineKeyboardMarkup|null {

        if (!this.package.data.dependencies) {
            return null;
        }

        let buttons = [];
        let row = [];
        let i = 0;

        const length = Object.keys(this.package.data.dependencies).length;

        for (let key in this.package.data.dependencies) {

            const button: InlineKeyboardButton = {
                text : `${key} ${this.package.data.dependencies[key]}`,
                callback_data : JSON.stringify({
                    c : "yarn",
                    d : {
                        package : key
                    }
                })
            };

            row.push(button);

            if (++i === length || row.length % 2 === 0) {
                buttons.push(row);
                row = [];
            }
        }

        const markup: InlineKeyboardMarkup = {
            inline_keyboard : buttons
        };

        return markup;
    }

    /**
     * Adds the package description.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addDescription() {
        this.message.push(Lang.get("packageDescription").replace("{description}", this.package.data.description));
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

        if (this.package.data.name?.length) {
            this.message.push(Lang.get("packageName").replace("{name}", this.package.data.name));
        }

        let version;
        if (this.package.data?.version) {
            version = this.package.data.version;
            this.message.push(Lang.get("packageVersion").replace("{version}", version));
        }

        if (this.package.data?.time && this.package.data.time[version]) {
            this.message.push(Lang.get("packageDate").replace("{date}", this.package.data.time[version]));
        }

        if (this.package.data.dist?.unpackedSize) {
            const size = SizeHelper.disk(this.package.data.dist?.unpackedSize);
            this.message.push(Lang.get("packageSize").replace("{size}", size));
        }

        this.message.length === countBefore || this.message.push("");
    }

    /**
     * Adds the package links.
     *
     * @author Marcos Leandro
     * @since  2022-10-11
     */
    private addLinks() {

        if (!this.package.data?.homepage && !this.package.data?.repository) {
            return;
        }

        this.message.push(Lang.get("packageLinks"));

        if (this.package.data?.homepage) {
            const homepageLink = Lang.get("packageLink")
                .replace("{linkurl}", this.package.data.homepage)
                .replace("{linkname}", Lang.get("packageHomepage"));

            this.message.push(homepageLink);
        }

        if (this.package.data?.repository?.url) {

            let url = this.package.data.repository.url;
            url = url.replace("git+", "");

            const type = this.package.data.repository.type;
            const title = type[0].toUpperCase() + type.substring(1);

            const repositoryLink = Lang.get("packageLink")
                .replace("{linkurl}", url)
                .replace("{linkname}", title);

            this.message.push(repositoryLink);
        }

        if (this.package.data?.bugs) {

            const bugsLink = Lang.get("packageLink")
                .replace("{linkurl}", this.package.data.bugs.url)
                .replace("{linkname}", "Bugs");

            this.message.push(bugsLink);
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

        if (!this.package.data?.author) {
            return;
        }

        const person = this.formatPerson(this.package.data.author);
        this.message.push(Lang.get("packageAuthor"));
        this.message.push(Lang.get("packagePerson").replace("{person}", person));
        this.message.push("");
    }

    /**
     * Adds the package publisher, if it has one.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addPublisher() {

        if (!this.package.data?.publisher) {
            return;
        }

        const person = this.formatPerson(this.package.data.publisher);
        this.message.push(Lang.get("packagePublisher"));
        this.message.push(Lang.get("packagePerson").replace("{person}", person));
        this.message.push("");
    }

    /**
     * Adds the package maintainers, if it has some.
     *
     * @author Marcos Leandro
     * @since  2022-10-06
     */
    private addMaintainers() {

        if (!this.package.data?.maintainers?.length) {
            return;
        }

        this.message.push(Lang.get("packageMaintainers"));
        for (let maintainer of this.package.data.maintainers) {
            const person = this.formatPerson(maintainer);
            this.message.push(Lang.get("packagePerson").replace("{person}", person));
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

        if (!this.package.data?.keywords?.length) {
            return;
        }

        this.message.push(Lang.get("packageKeywords"));

        let keywords = [];
        for (let keyword of this.package.data.keywords) {
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
        this.message.push(Lang.get("yarnPackageInstall").replace("{package}", this.package.data.name));
        this.message.push("");
        this.message.push(Lang.get("playgroundLink").replace("{package}", this.package.data.name));

        if (this.package.data?.dependencies) {
            this.message.push("");
            this.message.push(Lang.get("packageDependencies"));
        }
    }
}
