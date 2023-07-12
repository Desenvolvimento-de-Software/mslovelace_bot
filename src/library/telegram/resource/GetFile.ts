/**
 * Catbot Telegram Bot
 *
 * This file is part of Catbot Telegram Bot.
 * You are free to modify and share this project or its files.
 *
 * @package  moe_catbot
 * @author   Marcos Leandro <mleandrojr@yggdrasill.com.br>
 * @license  GPLv3 <http://www.gnu.org/licenses/gpl-3.0.en.html>
 */

import TelegramBotApi from "../TelegramBotApi.js";

export default class GetFile extends TelegramBotApi {

    /**
     * Method payload.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected payload: Record<string, any> = {};

     /**
      * The constructor.
      *
      * @author Marcos Leandro
      * @since  1.0.0
      */
    public constructor() {
        super("getFile");
    }

    /**
     * Sets the unique file ID.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param fileId
     */
    setFileId(fileId: string): GetFile {
        this.payload.fileId = fileId;
        return this;
    }
}
