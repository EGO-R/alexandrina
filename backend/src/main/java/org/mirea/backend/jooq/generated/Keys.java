/*
 * This file is generated by jOOQ.
 */
package org.mirea.backend.jooq.generated;


import org.jooq.ForeignKey;
import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.Internal;
import org.mirea.backend.jooq.generated.tables.AuthProviders;
import org.mirea.backend.jooq.generated.tables.PlaylistVideo;
import org.mirea.backend.jooq.generated.tables.Playlists;
import org.mirea.backend.jooq.generated.tables.RefreshTokens;
import org.mirea.backend.jooq.generated.tables.Users;
import org.mirea.backend.jooq.generated.tables.Videos;
import org.mirea.backend.jooq.generated.tables.records.AuthProvidersRecord;
import org.mirea.backend.jooq.generated.tables.records.PlaylistVideoRecord;
import org.mirea.backend.jooq.generated.tables.records.PlaylistsRecord;
import org.mirea.backend.jooq.generated.tables.records.RefreshTokensRecord;
import org.mirea.backend.jooq.generated.tables.records.UsersRecord;
import org.mirea.backend.jooq.generated.tables.records.VideosRecord;


/**
 * A class modelling foreign key relationships and constraints of tables in
 * public.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes", "this-escape" })
public class Keys {

    // -------------------------------------------------------------------------
    // UNIQUE and PRIMARY KEY definitions
    // -------------------------------------------------------------------------

    public static final UniqueKey<AuthProvidersRecord> AUTH_PROVIDERS_PKEY = Internal.createUniqueKey(AuthProviders.AUTH_PROVIDERS, DSL.name("auth_providers_pkey"), new TableField[] { AuthProviders.AUTH_PROVIDERS.ID }, true);
    public static final UniqueKey<PlaylistsRecord> PLAYLISTS_PKEY = Internal.createUniqueKey(Playlists.PLAYLISTS, DSL.name("playlists_pkey"), new TableField[] { Playlists.PLAYLISTS.ID }, true);
    public static final UniqueKey<RefreshTokensRecord> REFRESH_TOKENS_PKEY = Internal.createUniqueKey(RefreshTokens.REFRESH_TOKENS, DSL.name("refresh_tokens_pkey"), new TableField[] { RefreshTokens.REFRESH_TOKENS.USER_ID }, true);
    public static final UniqueKey<UsersRecord> USERS_EMAIL_KEY = Internal.createUniqueKey(Users.USERS, DSL.name("users_email_key"), new TableField[] { Users.USERS.EMAIL }, true);
    public static final UniqueKey<UsersRecord> USERS_PKEY = Internal.createUniqueKey(Users.USERS, DSL.name("users_pkey"), new TableField[] { Users.USERS.ID }, true);
    public static final UniqueKey<VideosRecord> VIDEOS_PKEY = Internal.createUniqueKey(Videos.VIDEOS, DSL.name("videos_pkey"), new TableField[] { Videos.VIDEOS.ID }, true);
    public static final UniqueKey<VideosRecord> VIDEOS_PREVIEW_KEY = Internal.createUniqueKey(Videos.VIDEOS, DSL.name("videos_preview_key"), new TableField[] { Videos.VIDEOS.PREVIEW }, true);
    public static final UniqueKey<VideosRecord> VIDEOS_VIDEO_URL_KEY = Internal.createUniqueKey(Videos.VIDEOS, DSL.name("videos_video_url_key"), new TableField[] { Videos.VIDEOS.VIDEO_URL }, true);

    // -------------------------------------------------------------------------
    // FOREIGN KEY definitions
    // -------------------------------------------------------------------------

    public static final ForeignKey<AuthProvidersRecord, UsersRecord> AUTH_PROVIDERS__AUTH_PROVIDERS_USER_ID_FKEY = Internal.createForeignKey(AuthProviders.AUTH_PROVIDERS, DSL.name("auth_providers_user_id_fkey"), new TableField[] { AuthProviders.AUTH_PROVIDERS.USER_ID }, Keys.USERS_PKEY, new TableField[] { Users.USERS.ID }, true);
    public static final ForeignKey<PlaylistVideoRecord, PlaylistsRecord> PLAYLIST_VIDEO__PLAYLIST_VIDEO_PLAYLIST_ID_FKEY = Internal.createForeignKey(PlaylistVideo.PLAYLIST_VIDEO, DSL.name("playlist_video_playlist_id_fkey"), new TableField[] { PlaylistVideo.PLAYLIST_VIDEO.PLAYLIST_ID }, Keys.PLAYLISTS_PKEY, new TableField[] { Playlists.PLAYLISTS.ID }, true);
    public static final ForeignKey<PlaylistVideoRecord, VideosRecord> PLAYLIST_VIDEO__PLAYLIST_VIDEO_VIDEO_ID_FKEY = Internal.createForeignKey(PlaylistVideo.PLAYLIST_VIDEO, DSL.name("playlist_video_video_id_fkey"), new TableField[] { PlaylistVideo.PLAYLIST_VIDEO.VIDEO_ID }, Keys.VIDEOS_PKEY, new TableField[] { Videos.VIDEOS.ID }, true);
    public static final ForeignKey<PlaylistsRecord, UsersRecord> PLAYLISTS__PLAYLISTS_USER_ID_FKEY = Internal.createForeignKey(Playlists.PLAYLISTS, DSL.name("playlists_user_id_fkey"), new TableField[] { Playlists.PLAYLISTS.USER_ID }, Keys.USERS_PKEY, new TableField[] { Users.USERS.ID }, true);
    public static final ForeignKey<RefreshTokensRecord, UsersRecord> REFRESH_TOKENS__REFRESH_TOKENS_USER_ID_FKEY = Internal.createForeignKey(RefreshTokens.REFRESH_TOKENS, DSL.name("refresh_tokens_user_id_fkey"), new TableField[] { RefreshTokens.REFRESH_TOKENS.USER_ID }, Keys.USERS_PKEY, new TableField[] { Users.USERS.ID }, true);
    public static final ForeignKey<VideosRecord, UsersRecord> VIDEOS__VIDEOS_USER_ID_FKEY = Internal.createForeignKey(Videos.VIDEOS, DSL.name("videos_user_id_fkey"), new TableField[] { Videos.VIDEOS.USER_ID }, Keys.USERS_PKEY, new TableField[] { Users.USERS.ID }, true);
}
