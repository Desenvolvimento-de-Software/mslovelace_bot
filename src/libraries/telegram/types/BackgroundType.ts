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

import { BackgroundFillSolid, BackgroundFillGradient, BackgroundFillFreeformGradient } from "./BackgroundFill";

export type BackgroundType = {
    type: string;
};

export type BackgroundTypeFill = BackgroundType & {
    fill: BackgroundFillSolid|BackgroundFillGradient|BackgroundFillFreeformGradient;
    dark_theme_dimming: number;
};

export type BackgroundTypeWallpaper = BackgroundType & {
    document: Document;
    dark_theme_dimming: number;
    is_blurred?: true;
    is_moving?: true;
};

export type BackgroundTypePattern = BackgroundType & {
    document: Document;
    fill: BackgroundFillSolid|BackgroundFillGradient|BackgroundFillFreeformGradient;
    intensity: number;
    is_inverted?: true;
    is_moving?: true;
};

export type BackgroundTypeChatheme = BackgroundType & {
    theme_name: string;
};
