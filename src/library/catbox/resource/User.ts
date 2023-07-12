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

import CatboxApi from "../CatboxApi.js";
import { FormData } from "formdata-node";
import { Blob } from "buffer";

export default class User extends CatboxApi {

    /**
     * Request FormData
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    protected formData: FormData;

    /**
     * The constructor.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     */
    public constructor() {
        super("user/api.php");
        this.formData = new FormData();
    }

    /**
     * Sets the request type.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param reqType
     *
     * @return This instance.
     */
    public setReqType(reqType: String): User {
        this.formData.set("reqtype", reqType);
        return this;
    }

    /**
     * Sets the user hash.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param userHash
     *
     * @return This instance.
     */
    public setUserHash(userHash: String): User {
        this.formData.set("userhash", userHash);
        return this;
    }

    /**
     * Sets the file to be sent.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param file
     * @param filename
     *
     * @return This instance.
     */
    public setFileToUpload(file: Blob, filename: string): User {
        this.formData.set("fileToUpload", file, filename);
        return this;
    }

    /**
     * Sets the file URL.
     *
     * @author Marcos Leandro
     * @since  1.0.0
     *
     * @param url
     *
     * @return This instance.
     */
    public setUrl(url: String): User {
        this.formData.set("url", url);
        return this;
    }
}
