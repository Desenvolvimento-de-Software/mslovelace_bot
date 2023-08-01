CREATE TABLE `ada`.`bans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `chat_id` INT UNSIGNED NOT NULL,
  `reason` VARCHAR(50) NULL,
  `date` INT UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_user_id_chat_id` (`chat_id` ASC, `user_id` ASC) VISIBLE,
  INDEX `fk_bans_user_id_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_bans_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `ada`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bans_chat_id`
    FOREIGN KEY (`chat_id`)
    REFERENCES `ada`.`chats` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);
