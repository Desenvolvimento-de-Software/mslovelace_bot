CREATE TABLE IF NOT EXISTS `shield` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `telegram_user_id` BIGINT(10) UNSIGNED NOT NULL,
  `date` INT(10) UNSIGNED NOT NULL,
  `reason` TEXT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY idx_telegram_user_id (`telegram_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
