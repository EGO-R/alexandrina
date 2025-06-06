package org.mirea.backend.repositories.playlists.queries

import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.UserID

class PlaylistRepositorySearchQuery internal constructor(
    val ids: List<PlaylistID>?,
    val userID: UserID?,
    val isAllAvailable: Boolean,
    val currentUserId: UserID,
) {
    companion object {
        fun create(currentUser: UserEntity, cb: PlaylistRepositorySearchQueryBuilder.() -> Unit) =
            PlaylistRepositorySearchQueryBuilder(currentUser.id).apply {
                isAllAvailable = currentUser.isAdmin()
            }.apply(cb).build()
    }
    class PlaylistRepositorySearchQueryBuilder(
        val currentUserId: UserID,
    ) {
        var ids: List<PlaylistID>? = null
        var userID: UserID? = null
        var isAllAvailable: Boolean = false

        fun build(): PlaylistRepositorySearchQuery = PlaylistRepositorySearchQuery(
            ids = ids,
            userID = userID,
            isAllAvailable = isAllAvailable,
            currentUserId = currentUserId,
        )
    }
}