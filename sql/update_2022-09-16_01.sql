CREATE TABLE `chat_configs` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `chat_id` int(10) unsigned NOT NULL,
    `greetings` tinyint(1) NOT NULL DEFAULT 0,
    `goodbye` tinyint(1) NOT NULL DEFAULT 0,
    `warn_name_changing` tinyint(1) NOT NULL DEFAULT 0,
    `remove_event_messages` tinyint(1) unsigned NOT NULL DEFAULT 0,
    `restrict_new_users` tinyint(1) unsigned NOT NULL DEFAULT 0,
    `captcha` tinyint(1) unsigned NOT NULL DEFAULT 0,
    `warn_ask_to_ask` tinyint(1) unsigned NOT NULL DEFAULT 0,
    `adashield` tinyint(3) unsigned NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    CONSTRAINT `fk_chat_configs_chat_id` FOREIGN KEY (`chat_id`) REFERENCES chats(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO chat_configs (`chat_id`, `greetings`, `goodbye`, `warn_name_changing`, `remove_event_messages`, `restrict_new_users`, `warn_ask_to_ask`, `adashield`)
SELECT `id`, `greetings`, `goodbye`, `warn_name_changing`, `remove_event_messages`, `restrict_new_users`, `warn_ask_to_ask`, `adashield` FROM `chats`;

ALTER TABLE `chats`
DROP `greetings`,
DROP `grouped_greetings`,
DROP `goodbye`,
DROP `tips`,
DROP `warn_name_changing`,
DROP `remove_event_messages`,
DROP `restrict_new_users`,
DROP `warn_ask_to_ask`,
DROP `adashield`;

ALTER TABLE `rel_users_chats` DROP `greeted`;
ALTER TABLE `rel_users_chats` ADD `checked` TINYINT(1) UNSIGNED NOT NULL DEFAULT '0' AFTER `joined`;
