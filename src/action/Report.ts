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

import Action from "action/Action";
import CommandContext from "context/Command";
import Context from "context/Context";
import ReportCommand from "command/Report";
import { Options as OptionsType } from "type/Options";

export default class Report extends Action {

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param context
     */
    public constructor(context: Context) {
        super(context, "async");
    }

    /**
     * Runs the action.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     */
    public async run(): Promise<void> {

        const message = this.context.getMessage();
        if (!message) {
            return;
        }

        const text = message.getText();
        const entities = message.getEntities();

        for (const entity of entities) {
            this.parseEntity(text, entity);
        }
    }

    /**
     * Parses the entity.
     *
     * @author Marcos Leandro
     * @since  2023-06-07
     *
     * @param text
     * @param entity
     */
    private async parseEntity(text: string, entity: Record<string, any>): Promise<void> {

        if (entity.type !== "mention") {
            return;
        }

        const mention = text.substring(entity.offset, entity.offset + entity.length);
        if (mention !== "admin") {
            return;
        }

        const options: OptionsType = {
            start: entity.offset,
            end: entity.end,
        };

        const reportCommand = new ReportCommand();
        await reportCommand.run(new CommandContext("", options), this.context);

        return Promise.resolve();
    }
}
