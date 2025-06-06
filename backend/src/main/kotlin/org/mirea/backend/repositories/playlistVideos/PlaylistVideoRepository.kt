package org.mirea.backend.repositories.playlistVideos

import org.mirea.backend.repositories.JooqScope
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.VideoID
import org.springframework.stereotype.Repository

@Repository
class PlaylistVideoRepository(
    private val jooqScope: JooqScope,
) {
    suspend fun get(
        playlistId: PlaylistID,
        videoId: VideoID,
    ) = jooqScope.useDslContext { ctx ->
        ctx
            .select(
                
            )
    }
}