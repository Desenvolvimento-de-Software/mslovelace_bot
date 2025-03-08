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

import fs from "fs";
import path from "path";

export default class Log {

    /**
     * Log colors.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @type {Object}
     */
    private static colors: Record<string, string> = {
        Reset: "\x1b[0m",
        Bright: "\x1b[1m",
        Dim: "\x1b[2m",
        Underscore: "\x1b[4m",
        Blink: "\x1b[5m",
        Reverse: "\x1b[7m",
        Hidden: "\x1b[8m",

        FgBlack: "\x1b[30m",
        FgRed: "\x1b[31m",
        FgGreen: "\x1b[32m",
        FgYellow: "\x1b[33m",
        FgBlue: "\x1b[34m",
        FgMagenta: "\x1b[35m",
        FgCyan: "\x1b[36m",
        FgWhite: "\x1b[37m",

        BgBlack: "\x1b[40m",
        BgRed: "\x1b[41m",
        BgGreen: "\x1b[42m",
        BgYellow: "\x1b[43m",
        BgBlue: "\x1b[44m",
        BgMagenta: "\x1b[45m",
        BgCyan: "\x1b[46m",
        BgWhite: "\x1b[47m"
    }

    /**
     * Log a message and stack trace to console if the first argument is false.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static assert(...params: any[]): void {
        console.assert(new Date().toISOString(), ...params);
    }

    /**
     * Clear the console.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     */
    public static clear(): void {
        console.clear();
    }

    /**
     * Log the number of times this line has been called with the given label.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static count(...params: any[]): void {
        console.count(...params);
    }

    /**
     * Resets the value of the counter with the given label.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static countReset(...params: any[]): void {
        console.countReset(...params);
    }

    /**
     * Outputs a message to the console with the log level debug.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static debug(...params: any[]): void {
        console.debug(Log.colors.FgCyan, ...Log.parse(...params), Log.colors.Reset);
    }

    /**
     * Displays an interactive listing of the properties of a specified JavaScript object.
     * This listing lets you use disclosure triangles to examine the contents of child objects.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static dir(...params: any[]): void {
        console.dir(...params);
    }

    /**
     * Displays an XML/HTML Element representation of the specified object if possible
     * or the JavaScript Object view if it is not possible.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static dirxml(...params: any[]): void {
        console.dirxml(...params);
    }

    /**
     * Outputs an error message. You may use string substitution and additional arguments with this method.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static error(...params: any[]): void {
        console.error(Log.colors.FgRed, ...Log.parse(...params), Log.colors.Reset);
    }

    /**
     * Creates a new inline group, indenting all following output by another level.
     * To move back out a level, call groupEnd().
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static group(...params: any[]): void {
        console.group(...params);
    }

    /**
     * Creates a new inline group, indenting all following output by another level.
     * However, unlike group() this starts with the inline group collapsed requiring
     * the use of a disclosure button to expand it. To move back out a level, call groupEnd().
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static groupCollapsed(...params: any[]): void {
        console.groupCollapsed(...params);
    }

    /**
     * Exits the current inline group.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     */
    public static groupEnd(): void {
        console.groupEnd();
    }

    /**
     * Informative Loging of information.
     * You may use string substitution and additional arguments with this method.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {any[]} params
     */
    public static info(...params: any[]): void {
        console.info(Log.colors.FgBlue, ...Log.parse(...params), Log.colors.Reset);
    }

    /**
     * For general output of Loging information.
     * You may use string substitution and additional arguments with this method.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {...any[]} params
     */
    public static log(...params: any[]): void {
        console.log(Log.colors.Reset, ...Log.parse(...params));
    }

    /**
     * Displays tabular data as a table.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {...any[]} params
     */
    public static table(...params: any[]): void {
        console.table(...params);
    }

    /**
     * Starts a timer with a name specified as an input parameter.
     * Up to 10,000 simultaneous timers can run on a given page.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {...any[]} params
     */
    public static time(...params: any[]): void {
        console.time(...params);
    }

    /**
     * Stops the specified timer and logs the elapsed time in milliseconds since it started.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {...any[]} params
     */
    public static timeEnd(...params: any[]): void {
        console.timeEnd(...params);
    }

    /**
     * Logs the value of the specified timer to the console.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {...any[]} params
     */
    public static timeLog(...params: any[]): void {
        console.timeLog(...params);
    }

    /**
     * Outputs a stack trace.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {...any[]} params
     */
    public static trace(...params: any[]): void {
        console.trace(...params);
    }

    /**
     * Outputs a warning message. You may use string substitution and additional arguments with this method.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @param {...any[]} params
     */
    public static warn(...params: any[]): void {
        console.warn(Log.colors.FgYellow, ...Log.parse(...params), Log.colors.Reset);
    }

    /**
     * Adds the current datetime to the message.
     *
     * @author Marcos Leandro <mleandrojr@yggdrasill.com.br>
     * @since  2023-06-21
     *
     * @return {string[]}
     */
    public static parse(...params: string[]): string[] {
        return [new Date().toISOString(), ...params];
    }

    /**
     * Saves an entry to the log.
     *
     * @author Marcos Leandro
     * @since  2023-06-13
     *
     * @param {string}  content
     * @param {boolean} print
     */
    public static save(content: string, stack?: string, print?: boolean, level?: string): void {

        const date = new Date();

        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = (date.getDate()).toString().padStart(2, "0");

        const hours = (date.getHours()).toString().padStart(2, "0");
        const minutes = (date.getMinutes()).toString().padStart(2, "0");
        const seconds = (date.getSeconds()).toString().padStart(2, "0");

        const directory = path.resolve();
        const filename = `${year}-${month}-${day}.log`;

        let log = `${hours}:${minutes}:${seconds} :: ${content}\n`;
        if (stack) {
            log += `${stack}\n`;
        }

        fs.appendFileSync(`${directory}/log/${filename}`, log);

        type LogLevel = "assert" | "clear" | "count" | "countReset" | "debug" | "dir" | "dirxml" | "error" | "group" | "groupCollapsed" | "groupEnd" | "info" | "log" | "table" | "time" | "timeEnd" | "timeLog" | "trace" | "warn";
        const method: LogLevel = level?.toLowerCase() as LogLevel || "log";
        !print || Log[method](content);
    }
}
