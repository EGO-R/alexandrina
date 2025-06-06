package org.mirea.backend.repositories.playlists

import org.mirea.backend.entities.playlists.PlaylistEntity
import org.mirea.backend.entities.playlists.PlaylistWithAuthor
import org.mirea.backend.jooq.generated.Tables.*
import org.mirea.backend.repositories.JooqScope
import org.mirea.backend.repositories.playlists.queries.PlaylistRepositorySearchQuery
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.VideoID
import org.mirea.backend.utils.repositories.asPlaylistID
import org.springframework.stereotype.Repository

@Repository
class PlaylistsRepository(
    private val jooqScope: JooqScope,
    private val mapper: PlaylistMapper,
) {
    suspend fun getById(id: PlaylistID): PlaylistEntity? = jooqScope.useDslContext { ctx ->
        ctx
            .select(playlistMapper)
            .from(PLAYLISTS)
            .where(PLAYLISTS.ID.eq(id.value))
            .fetchOne()
            ?.toPlaylistEntity()
    }

    suspend fun getByIdWithAuthor(id: PlaylistID): PlaylistWithAuthor? = jooqScope.useDslContext { ctx ->
        ctx
            .select(playlistWithAuthorMapper)
            .from(
                PLAYLISTS
                    .join(USERS).on(PLAYLISTS.USER_ID.eq(USERS.ID))
            )
            .where(PLAYLISTS.ID.eq(id.value))
            .fetchOne()
            ?.toPlaylistWithAuthorEntity()
    }

    suspend fun search(query: PlaylistRepositorySearchQuery): List<PlaylistEntity> =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(playlistMapper)
                .from(PLAYLISTS)
                .where(query.toCondition())
                .fetch()
                .map { it.toPlaylistEntity() }
        }

    suspend fun searchPlaylistWithAuthor(query: PlaylistRepositorySearchQuery): List<PlaylistWithAuthor> =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(playlistWithAuthorMapper)
                .from(
                    PLAYLISTS
                        .join(USERS).on(USERS.ID.eq(PLAYLISTS.USER_ID))
                )
                .where(query.toCondition())
                .fetch()
                .map { it.toPlaylistWithAuthorEntity() }
        }

    suspend fun upsert(entity: PlaylistEntity): PlaylistEntity = jooqScope.useDslContext { ctx ->
        ctx
            .insertInto(PLAYLISTS)
            .set(mapper.record(entity))
            .onDuplicateKeyUpdate()
            .set(mapper.updateRecord(entity))
            .returning(playlistMapper)
            .fetchOne()!!
            .toPlaylistEntity()
    }

    suspend fun delete(id: PlaylistID): Unit = jooqScope.useDslContext { ctx ->
        ctx
            .deleteFrom(PLAYLISTS)
            .where(PLAYLISTS.ID.eq(id.value))
            .execute()
    }

    suspend fun getVideoPlaylists(
        videoId: VideoID,
        query: PlaylistRepositorySearchQuery,
    ): List<PlaylistWithAuthor> =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(playlistWithAuthorMapper)
                .from(
                    PLAYLIST_VIDEO
                        .join(PLAYLISTS)
                        .on(
                            PLAYLIST_VIDEO.PLAYLIST_ID.eq(PLAYLISTS.ID)
                                .and(query.toCondition())
                        )
                        .join(USERS).on(PLAYLISTS.USER_ID.eq(USERS.ID))
                )
                .where(PLAYLIST_VIDEO.VIDEO_ID.eq(videoId.value))
                .fetch()
                .map { it.toPlaylistWithAuthorEntity() }
        }

    suspend fun deleteVideoPlaylists(
        videoId: VideoID,
        playlistIds: Collection<PlaylistID>,
    ): Unit = jooqScope.useDslContext { ctx ->
        ctx
            .delete(PLAYLIST_VIDEO)
            .where(
                PLAYLIST_VIDEO.VIDEO_ID.eq(videoId.value)
                    .and(PLAYLIST_VIDEO.PLAYLIST_ID.asPlaylistID().`in`(playlistIds))
            )
            .execute()
    }

    // todo: add multiple insert
    suspend fun upsertVideoPlaylist(
        videoId: VideoID,
        playlistId: PlaylistID,
    ) = jooqScope.useDslContext { ctx ->
        ctx
            .insertInto(PLAYLIST_VIDEO)
            .set(PLAYLIST_VIDEO.PLAYLIST_ID, playlistId.value)
            .set(PLAYLIST_VIDEO.VIDEO_ID, videoId.value)
            .onDuplicateKeyIgnore()
            .execute()

    }
}