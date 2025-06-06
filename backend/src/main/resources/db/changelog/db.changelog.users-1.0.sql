--liquibase formatted sql

--changeset EGO-R:1
create table if not exists users
(
    id    bigserial primary key,
    email varchar(65) not null unique,
    name  varchar(65) not null ,
    role smallint not null default 0 ,
    avatar VARCHAR(65)
);
