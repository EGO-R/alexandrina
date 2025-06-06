--liquibase formatted sql

--changeset EGO-R:1
CREATE TABLE IF NOT EXISTS playlists(
    id BIGSERIAL PRIMARY KEY ,
    name VARCHAR(30) NOT NULL ,
    privacy_type INT NOT NULL DEFAULT 0 ,
    user_id bigint       not null references users (id) ON DELETE CASCADE ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL ,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

--changeset EGO-R:2
create table if not exists playlist_video(
    video_id BIGINT NOT NULL REFERENCES videos (id) ON DELETE CASCADE ,
    playlist_id BIGINT NOT NULL REFERENCES playlists (id) ON DELETE CASCADE ,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL ,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
)
