alter table rel_users_chats add column captcha char(6) null default null after joined;

alter table messages change column type type varchar(30);

update messages set type = 'edited_message' where type = 'editedMessage';
update messages set type = 'channel_post' where type = 'channelPost';
update messages set type = 'edited_channel_post' where type = 'editedChannelPost';
update messages set type = 'inline_query' where type = 'inlineQuery';
update messages set type = 'chosen_inline_result' where type = 'chosenInlineResult';
update messages set type = 'callback_query' where type = 'callbackQuery';
update messages set type = 'shipping_query' where type = 'shippingQuery';
update messages set type = 'pre_checkout_query' where type = 'preCheckoutQuery';
update messages set type = 'poll_answer' where type = 'pollAnswer';
update messages set type = 'my_chat_member' where type = 'myChatMember';
update messages set type = 'chat_member' where type = 'chatMember';
update messages set type = 'chat_join_request' where type = 'chatJoinRequest';

alter table messages
change column type type enum('message','edited_message','channel_post','edited_channel_post','inline_query','chosen_inline_result','callback_query','shipping_query','pre_checkout_query','poll','poll_answer','my_chat_member','chat_member','chat_join_request') NOT NULL DEFAULT 'message';

alter table messages change column callbackQuery callback_query longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL;
