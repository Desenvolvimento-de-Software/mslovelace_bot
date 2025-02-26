alter table chat_configs
change column warns warnings int(10) unsigned not null default 3;

alter table messages
add column ttl int(10) unsigned null default null after date,
add column status tinyint(1) unsigned not null default 1 after ttl;

alter table rel_users_chats
add column ttl int(10) unsigned null default null after date;
