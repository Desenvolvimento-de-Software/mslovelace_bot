ALTER TABLE `chats` ADD `restrict_new_users` TINYINT(1) UNSIGNED NOT NULL DEFAULT 0 AFTER `remove_event_messages`;
