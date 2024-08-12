alter table users change column language_code language_code varchar(20) DEFAULT 'us';
alter table chats change column language language varchar(20) NOT NULL DEFAULT 'us';
