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

import { createCanvas } from "canvas";

export default class Captcha {

    public static generate(code: string): Buffer {

        const canvas = createCanvas(300, 100);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#dcdcdc";
        ctx.lineWidth = 1;

        for (let i = 0; i < 10; i++) {

            const x1 = Math.floor(Math.random() * canvas.width);
            const y1 = Math.floor(Math.random() * canvas.height);
            const x2 = Math.floor(Math.random() * canvas.width);
            const y2 = Math.floor(Math.random() * canvas.height);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }

        ctx.font = "72px 'Arial'";
        ctx.fillStyle = "#333333";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(code, Math.floor(canvas.width / 2), Math.floor(canvas.height / 2));

        for (let i = 0; i < 20; i++) {

            const x = Math.floor(Math.random() * canvas.width);
            const y = Math.floor(Math.random() * canvas.height);

            ctx.beginPath();
            ctx.arc(x, y, Math.floor(Math.random() * 3) + 1, 0, Math.PI * 2);
            ctx.fillStyle = "#bbb";
            ctx.fill();
        }

        const buffer = canvas.toBuffer("image/png");
        return buffer;
    }
}
