ALTER TABLE `warns` ADD `status` TINYINT(1) UNSIGNED NOT NULL DEFAULT 1 AFTER `reason`;
RENAME TABLE `warns` TO `warnings`;
