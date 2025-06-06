package org.mirea.backend.repositories.video

import org.mirea.backend.entities.video.VideoEntity
import org.mirea.backend.entities.video.VideoWithAuthor
import org.mirea.backend.jooq.generated.Tables.*
import org.mirea.backend.repositories.JooqScope
import org.mirea.backend.repositories.video.queries.VideoRepositorySearchQuery
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.VideoID
import org.mirea.backend.utils.repositories.paginated
import org.springframework.stereotype.Repository

@Repository
class VideoRepository(
    private val jooqScope: JooqScope,
    private val mapper: VideoMapper,
) {
    suspend fun searchTest(query: VideoRepositorySearchQuery): List<VideoEntity> =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(videoMapper)
                .from(VIDEOS)
                .where(query.toCondition())
                .paginated(query.paginationData)
                .fetch()
                .map { it.toVideoEntity() }
        }

    suspend fun search(query: VideoRepositorySearchQuery): List<VideoEntity> =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(videoMapper)
                .from(VIDEOS)
                .where(query.toCondition())
                .paginated(query.paginationData)
                .fetch()
                .map { it.toVideoEntity() }
        }

    suspend fun getById(id: VideoID) =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(videoMapper)
                .from(VIDEOS)
                .join(USERS).on(VIDEOS.USER_ID.eq(USERS.ID))
                .where(VIDEOS.ID.eq(id.value))
                .fetchOne()
                ?.toVideoEntity()
        }

    suspend fun upsert(entity: VideoEntity) =
        jooqScope.useDslContext { ctx ->
            ctx
                .insertInto(VIDEOS)
                .set(mapper.record(entity))
                .onDuplicateKeyUpdate()
                .set(mapper.updateRecord(entity))
                .returning(videoMapper)
                .fetchOne()!!
                .toVideoEntity()
        }

    suspend fun delete(id: VideoID): Unit =
        jooqScope.useDslContext { ctx ->
            ctx
                .deleteFrom(VIDEOS)
                .where(VIDEOS.ID.eq(id.value))
                .execute()
        }

    suspend fun searchWithAuthors(query: VideoRepositorySearchQuery): List<VideoWithAuthor> =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(videoWithAuthorMapper)
                .from(VIDEOS)
                .join(USERS).on(VIDEOS.USER_ID.eq(USERS.ID))
                .where(query.toCondition())
                .paginated(query.paginationData)
                .fetch()
                .map { it.toVideoWithAuthor() }
        }

    suspend fun getWithAuthorById(id: VideoID) =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(videoWithAuthorMapper)
                .from(VIDEOS)
                .join(USERS).on(VIDEOS.USER_ID.eq(USERS.ID))
                .where(VIDEOS.ID.eq(id.value))
                .fetchOne()
                ?.toVideoWithAuthor()
        }

    suspend fun getPlaylistVideos(
        playlistId: PlaylistID,
        query: VideoRepositorySearchQuery,
    ): List<VideoWithAuthor> = jooqScope.useDslContext { ctx ->
        ctx
            .select(videoWithAuthorMapper)
            .from(
                PLAYLIST_VIDEO
                    .join(VIDEOS).on(
                        PLAYLIST_VIDEO.VIDEO_ID.eq(VIDEOS.ID)
                            .and(query.toCondition())
                    )
                    .join(USERS).on(VIDEOS.USER_ID.eq(USERS.ID))
            )
            .where(PLAYLIST_VIDEO.PLAYLIST_ID.eq(playlistId.value))
            .fetch()
            .map { it.toVideoWithAuthor() }
    }
}