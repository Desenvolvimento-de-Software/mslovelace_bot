ALTER TABLE `users` CHANGE `user_id` `user_id` BIGINT(10) NOT NULL;
ALTER TABLE `users` ADD `is_channel` TINYINT(1) UNSIGNED NOT NULL DEFAULT '0' AFTER `last_name`;
ALTER TABLE `messages` DROP KEY `idx_message_id`;
ALTER TABLE `messages` ADD UNIQUE KEY `idx_uq_chat_id_message_id` (`chat_id`,`message_id` ASC) USING BTREE;
