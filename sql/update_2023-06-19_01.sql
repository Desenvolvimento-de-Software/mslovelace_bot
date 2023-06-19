alter table messages
add column type enum('message', 'editedMessage', 'channelPost', 'editedChannelPost', 'inlineQuery', 'chosenInlineResult', 'callbackQuery', 'shippingQuery', 'preCheckoutQuery', 'poll', 'pollAnswer', 'myChatMember', 'ChatMember', 'ChatJoinRequest') not null default 'message'
after message_id;
