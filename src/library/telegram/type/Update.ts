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

import { Message } from "./Message";
import { BusinessConnection } from "./BusinessConnection";
import { MessageReactionUpdated } from "./MessageReactionUpdated";
import { MessageReactionCountUpdated } from "./MessageReactionCountUpdated";
import { InlineQuery } from "./InlineQuery";
import { ChosenInlineResult } from "./ChosenInlineResult";
import { CallbackQuery } from "./CallbackQuery";
import { ShippingQuery } from "./ShippingQuery";
import { PreCheckoutQuery } from "./PreCheckoutQuery";
import { Poll } from "./Poll";
import { PollAnswer } from "./PollAnswer";
import { ChatMemberUpdated } from "./ChatMemberUpdated";
import { ChatJoinRequest } from "./ChatJoinRequest";
import { ChatBoostUpdated } from "./ChatBoostUpdated";

export type Update = {
    update_id: number;
    message?: Message;
    edited_message?: Message;
    channel_post?: Message;
    edited_channel_post?: Message;
    business_connection?: BusinessConnection;
    business_message?: Message;
    edited_business_message?: Message;
    deleted_business_message?: Message;
    message_reaction?: MessageReactionUpdated;
    message_reaction_count?: MessageReactionCountUpdated;
    inline_query?: InlineQuery;
    chosen_inline_result?: ChosenInlineResult;
    callback_query?: CallbackQuery;
    shipping_query?: ShippingQuery;
    pre_checkout_query?: PreCheckoutQuery;
    poll?: Poll;
    poll_answer?: PollAnswer;
    my_chat_member?: ChatMemberUpdated;
    chat_member?: ChatMemberUpdated;
    chat_join_request?: ChatJoinRequest;
    chat_boost?: ChatBoostUpdated;
    removed_chat_boost?: ChatBoostUpdated;
};
