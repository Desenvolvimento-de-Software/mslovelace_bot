create table chat_rules (
	id int(10) unsigned auto_increment not null,
	chat_id int(10) unsigned not null,
	rules text,
	primary key (id),
	unique key idx_uq_chat_id (chat_id)
);
