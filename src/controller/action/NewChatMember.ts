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

import Action from "../Action.js";
import ChatMessages from "../../model/ChatMessages.js";
import SendMessage from "../../library/telegram/resource/SendMessage.js";
import UserHelper from "../../helper/User.js";
import ChatHelper from "../../helper/Chat.js";
import TextHelper from "../../helper/Text.js";

export default class NewChatMember extends Action {
  /**
   * The constructor.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   */
  public constructor() {
    super();
  }

  /**
   * Action routines.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   *
   * @param payload
   */
  public async run(payload: Record<string, any>): Promise<void> {
    this.saveUserAndChat(payload.message.new_chat_member, payload.message.chat);

    const chat = await ChatHelper.getChatByTelegramId(payload.message.chat.id);

    console.log("chat", chat);

    if (!chat) {
      return;
    }

    if (chat.grouped_greetings) {
      return;
    }

    const user = await UserHelper.getUserByTelegramId(
      payload.message.new_chat_member.id
    );

    console.log("user", user);
    if (!user) {
      return;
    }

    const chatMessages = new ChatMessages();
    chatMessages.select().where("id").equal(chat.id).offset(0).limit(1);

    let text =
      'Hey <a href="tg://user?id={userid}">{username}</a>, welcome to this group! If you have any questions, contact an admin.';

    const chatMessage = await chatMessages.execute();
    if (chatMessage) {
      text = TextHelper.format(
        chatMessage[0].greetings,
        payload.message.new_chat_member.id,
        payload.message.new_chat_member.first_name
      );
    }

    text = text.replace("{userid}", payload.message.new_chat_member.id);
    text = text.replace(
      "{username}",
      payload.message.new_chat_member.first_name ||
        payload.message.new_chat_member.username
    );

    const sendMessage = new SendMessage();
    sendMessage
      .setChatId(payload.message.chat.id)
      .setText(text)
      .setParseMode("HTML")
      .post();

    this.setUserAsGreeted(user, chat);
  }

  /**
   * Saves the user as greeted in chat.
   *
   * @author Marcos Leandro
   * @since  1.0.0
   */
  private async setUserAsGreeted(
    user: Record<string, any>,
    chat: Record<string, any>
  ): Promise<void> {}
}
