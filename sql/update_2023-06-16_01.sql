ALTER TABLE `messages` ADD `thread_id` INT(10) UNSIGNED NULL AFTER `chat_id`;
ALTER TABLE `messages` ADD `entities` TEXT NULL AFTER `content`;
