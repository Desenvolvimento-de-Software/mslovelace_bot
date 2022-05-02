CREATE TABLE IF NOT EXISTS `users_messages` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `chat_id` int(10) unsigned NOT NULL,
  `message_id` int(10) UNSIGNED NOT NULL,
  `reply_to` int(10) unsigned NULL DEFAULT NULL,
  `content` text NULL DEFAULT NULL,
  `date` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_user_id_chat_id` (`user_id` ASC, `chat_id` ASC) USING BTREE,
  UNIQUE KEY `idx_message_id` (`message_id` ASC) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `users_messages`
ADD CONSTRAINT `fk_users_messages_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `users_messages`
ADD CONSTRAINT `fk_users_messages_chat_id` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`);

ALTER TABLE `users_messages`
ADD CONSTRAINT `fk_users_messages_reply_to` FOREIGN KEY (`reply_to`) REFERENCES `users_messages`(`id`);
