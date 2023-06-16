ALTER TABLE `messages` ADD `thread_id` INT(10) UNSIGNED NULL AFTER `chat_id`;
ALTER TABLE `messages` ADD `entities` TEXT NULL AFTER `content`;
ALTER TABLE `messages` ADD `thread_id` INT(10) UNSIGNED NULL AFTER `chat_id`;
ALTER TABLE `messages` ADD `entities` TEXT NULL AFTER `content`;
ALTER TABLE `messages` DROP FOREIGN KEY `fk_messages_reply_to`;
ALTER TABLE `messages` ADD CONSTRAINT `fk_messages_reply_to` FOREIGN KEY (`reply_to`) REFERENCES `messages`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
