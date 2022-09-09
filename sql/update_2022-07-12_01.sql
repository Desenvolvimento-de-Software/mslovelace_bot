ALTER TABLE `chats` ADD COLUMN `warn_ask_to_ask` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `restrict_new_users`;
