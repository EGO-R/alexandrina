package org.mirea.backend.entities.playlists

import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.UserID

data class PlaylistEntity(
    val id: PlaylistID,
    val name: String,
    val privacyType: PrivacyType,
    val userID: UserID,
) {
    fun isPublic() = privacyType == PrivacyType.PUBLIC
}