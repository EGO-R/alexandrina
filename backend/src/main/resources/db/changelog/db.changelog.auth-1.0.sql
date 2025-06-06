--liquibase formatted sql

--changeset EGO-R:1
create table if not exists auth_providers
(
    id               bigserial primary key,
    user_id          bigint       not null references users (id) on delete cascade ,
    provider_type    int          not null,
    provider_user_id bigint,
    credentials      varchar(256) not null
);

--changeset EGO-R:2
create table if not exists refresh_tokens
(
    user_id    bigint       primary key references users (id) on delete cascade ,
    token_hash varchar(256) not null ,
    expires_at timestamp    not null
);
