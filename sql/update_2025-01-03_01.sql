alter table chat_configs
add column captcha_ban_seconds int(10) unsigned not null default 300
after captcha;
