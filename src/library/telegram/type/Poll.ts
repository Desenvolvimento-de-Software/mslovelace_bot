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

import { MessageEntity } from "./MessageEntity.js";
import { PollOption } from "./PollOption.js";

export type Poll = {
    id: string;
    question: string;
    options: PollOption[];
    totalVoterCount: number;
    isClosed: boolean;
    isAnonymous: boolean;
    type: string;
    allowsMultipleAnswers: boolean;
    correctOptionId?: number;
    explanation?: string;
    explanationEntities?: MessageEntity[];
    openPeriod?: number;
    closeDate?: number;
};
