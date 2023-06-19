ALTER TABLE `messages`
ADD COLUMN `callbackQuery` JSON NULL DEFAULT NULL AFTER `content`,
CHANGE COLUMN `entities` `entities` JSON NULL DEFAULT NULL;

ALTER TABLE `messages`
DROP FOREIGN KEY `fk_messages_user_id`,
DROP FOREIGN KEY `fk_messages_chat_id`;
ALTER TABLE `ada`.`messages`
DROP INDEX `idx_user_id_chat_id` ,
DROP INDEX `idx_uq_chat_id_message_id`;

alter table `messages`
add key `idx_user_id_chat_id` (`user_id`, `chat_id`),
add key `idx_chat_id_message_id` (`chat_id`, `message_id`);

ALTER TABLE `ada`.`messages`
ADD CONSTRAINT `fk_messages_user_id`
  FOREIGN KEY (`user_id`)
  REFERENCES `ada`.`users` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_messages_chat_id`
  FOREIGN KEY (`chat_id`)
  REFERENCES `ada`.`chats` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;
