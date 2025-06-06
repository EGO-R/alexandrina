package org.mirea.backend.dto.playlists

import org.mirea.backend.entities.playlists.PlaylistEntity
import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.UserID

data class PlaylistCreateUpdateDto(
    val name: String,
    val privacyType: PrivacyType,
) {
    fun toEntity(id: PlaylistID = PlaylistID.EMPTY, authorId: UserID) = PlaylistEntity(
        id = id,
        name = name,
        privacyType = privacyType,
        userID = authorId,
    )

    fun toEntity(entity: PlaylistEntity) = PlaylistEntity(
        id = entity.id,
        name = name,
        privacyType = privacyType,
        userID = entity.userID,
    )
}