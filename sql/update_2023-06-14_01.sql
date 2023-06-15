create table warns (
    id int(10) unsigned auto_increment not null,
    user_id int(10) unsigned not null,
    chat_id int(10) unsigned not null,
    date int(10) unsigned not null,
    reason varchar(100),
    primary key (id),
    key idx_user_id_chat_id (user_id, chat_id),
    constraint fk_warns_user_id foreign key(user_id) references users(id),
    constraint fk_warns_chat_id foreign key(chat_id) references chats(id)
);

alter table chat_configs add warns int(10) unsigned null default '3' after adashield;
