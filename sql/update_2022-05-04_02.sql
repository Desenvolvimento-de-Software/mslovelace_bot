CREATE TABLE `ada`.`federations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `hash` varchar(32) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_hash` (`hash`),
  KEY `fk_federations_user_id_idx` (`user_id`),
  CONSTRAINT `fk_federations_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4

ALTER TABLE `ada`.`chats`
ADD COLUMN `federation_id` INT UNSIGNED NULL AFTER `id`,
ADD INDEX `idx_federation_id` (`federation_id` ASC) VISIBLE;

ALTER TABLE `ada`.`chats`
ADD CONSTRAINT `fk_chats_federation_id`
  FOREIGN KEY (`federation_id`)
  REFERENCES `ada`.`federations` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `ada`.`bans`
ADD COLUMN `federation_id` INT UNSIGNED NULL AFTER `chat_id`,
ADD INDEX `fk_bans_federation_id_idx` (`federation_id` ASC) VISIBLE;

ALTER TABLE `ada`.`bans`
ADD CONSTRAINT `fk_bans_federation_id`
  FOREIGN KEY (`federation_id`)
  REFERENCES `ada`.`federations` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `ada`.`rel_users_federations` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `federation_id` INT UNSIGNED NOT NULL,
  `date` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_uq_user_id_federation_id` (`user_id` ASC, `federation_id` ASC) VISIBLE,
  INDEX `fk_rel_users_federations_federation_id_idx` (`federation_id` ASC) VISIBLE,
  CONSTRAINT `fk_rel_users_federations_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `ada`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rel_users_federations_federation_id`
    FOREIGN KEY (`federation_id`)
    REFERENCES `ada`.`federations` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
