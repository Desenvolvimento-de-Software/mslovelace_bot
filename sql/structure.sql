SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `chats` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `chat_id` bigint(12) NOT NULL,
  `title` varchar(250) NOT NULL,
  `type` varchar(50) NOT NULL,
  `language` char(2) NOT NULL DEFAULT 'us',
  `joined` tinyint(1) NOT NULL DEFAULT 1,
  `goodbye` tinyint(1) NOT NULL DEFAULT 0,
  `tips` tinyint(1) DEFAULT 0,
  `warn_name_changing` tinyint(1) NOT NULL DEFAULT 0,
  `remove_event_messages` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_chat_id` (`chat_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `chat_id` int(12) UNSIGNED NOT NULL,
  `greetings` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_chat_id` (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `rel_users_chats` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `chat_id` int(10) UNSIGNED NOT NULL,
  `joined` tinyint(1) UNSIGNED NOT NULL DEFAULT 1,
  `greeted` tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_id_chat_id` (`user_id`,`chat_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_chat_id` (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `is_bot` tinyint(3) UNSIGNED NOT NULL,
  `language_code` char(2) DEFAULT 'br',
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `chat_messages`
  ADD CONSTRAINT `fk_message_chat_id` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`);

ALTER TABLE `rel_users_chats`
  ADD CONSTRAINT `fk_users_chats_chat_id` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`),
  ADD CONSTRAINT `fk_users_chats_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;
