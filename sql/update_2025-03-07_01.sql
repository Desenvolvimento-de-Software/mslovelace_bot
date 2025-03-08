alter table users change column is_bot is_bot tinyint(1) unsigned not null default 0;
alter table chat_configs change column adashield adashield tinyint(1) unsigned not null default 1;
drop table if exists migrations;
drop table if exists anniversaries;
drop table if exists facts;

alter table chat_configs add unique key `idx_uq_chat_id`(`chat_id`);
alter table chat_messages add unique key `idx_uq_chat_id` (`chat_id`);

alter table rel_users_chats
add column last_seen int(10) unsigned not null after date;

