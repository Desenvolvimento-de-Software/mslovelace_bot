alter table `messages`
add column `callbackquery` json null default null after `content`,
change column `entities` `entities` json null default null;

alter table `messages`
drop foreign key `fk_messages_user_id`,
drop foreign key `fk_messages_chat_id`;
alter table `ada`.`messages`
drop index `idx_user_id_chat_id` ,
drop index `idx_uq_chat_id_message_id`;

alter table `messages`
add key `idx_user_id_chat_id` (`user_id`, `chat_id`),
add key `idx_chat_id_message_id` (`chat_id`, `message_id`);

alter table `ada`.`messages`
add constraint `fk_messages_user_id`
  foreign key (`user_id`)
  references `ada`.`users` (`id`)
  on delete no action
  on update no action,
add constraint `fk_messages_chat_id`
  foreign key (`chat_id`)
  references `ada`.`chats` (`id`)
  on delete no action
  on update no action;

alter table `messages`
add column `animation` json null default null after `entities`,
add column `audio` json null default null after `animation`,
add column `document` json null default null after `audio`,
add column `photo` json null default null after `document`,
add column `sticker` json null default null after `photo`,
add column `video`  json null default null after `sticker`,
add column `video_note` json null default null after `video`,
add column `voice` json null default null after `video_note`,
add column `caption`  json null default null after `voice`,
add column `caption_entities` json null default null after `caption`;
