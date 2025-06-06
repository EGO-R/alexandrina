--liquibase formatted sql

--changeset EGO-R:1
create table if not exists videos
(
    id        bigserial primary key,
    name      varchar(256) not null,
    preview   varchar(256) not null unique,
    video_url varchar(256) not null unique,
    user_id   bigint       not null references users (id) on delete cascade ,
    privacy_type INT NOT NULL DEFAULT 0 ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL ,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
