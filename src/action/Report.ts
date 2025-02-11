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

import Action from "../action/Action.js";
import Context from "../library/telegram/context/Context.js";
import CommandContext from "../library/telegram/context/Command.js";
import ReportCommand from "../command/Report.js";
import { Options as OptionsType } from "../type/Options.js";

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

        const text = this.context.message.getText();
        const entities = this.context.message.getEntities();

        for (const entity of entities) {
            this.parseEntity(text, entity);
        }
    }

    private async parseEntity(text: string, entity: Record<string, any>): Promise<void> {

        if (entity.type !== "mention") {
            return;
        }

        const mention = text.substring(entity.offset, entity.offset + entity.length);
        if (mention !== "@admin") {
            return;
        }

        const options: OptionsType = {
            start: 0,
            end: 0,
        };

        const reportCommand = new ReportCommand();
        await reportCommand.run(new CommandContext("", options), this.context);
    }
}
