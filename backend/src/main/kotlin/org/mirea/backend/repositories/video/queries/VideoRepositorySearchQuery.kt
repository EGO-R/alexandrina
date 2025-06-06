package org.mirea.backend.repositories.video.queries

import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.jooq.generated.tables.records.VideosRecord
import org.mirea.backend.repositories.PaginationData
import org.mirea.backend.utils.ids.UserID
import org.mirea.backend.utils.ids.VideoID

data class VideoRepositorySearchQuery internal constructor(
    val name: String?,
    val userID: UserID?,
    val isAllAvailable: Boolean,
    val currentUserId: UserID,
    val paginationData: PaginationData<VideosRecord, *>?,
) {
    companion object {
        fun create(currentUserId: UserID, cb: VideoRepositorySearchQueryBuilder.() -> Unit) =
            VideoRepositorySearchQueryBuilder(currentUserId).apply(cb).build()

        fun create(currentUser: UserEntity, cb: VideoRepositorySearchQueryBuilder.() -> Unit) =
            VideoRepositorySearchQueryBuilder(currentUser.id).apply {
                isAllAvailable = currentUser.isAdmin()
            }.apply(cb).build()
    }

    class VideoRepositorySearchQueryBuilder(
        val currentUserId: UserID,
    ) {
        var name: String? = null
        var userID: UserID? = null
        var isAllAvailable: Boolean = false
        var paginationData: PaginationData<VideosRecord, *>? = null

        fun build() = VideoRepositorySearchQuery(
            name = name,
            userID = userID,
            paginationData = paginationData,
            isAllAvailable = isAllAvailable,
            currentUserId = currentUserId,
        )
    }
}