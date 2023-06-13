ALTER TABLE users ADD column is_premium TINYINT(1) unsigned NOT NULL DEFAULT 0 AFTER is_bot,
ADD KEY idx_is_premium (is_premium);
