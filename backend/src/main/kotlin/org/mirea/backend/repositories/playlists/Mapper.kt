package org.mirea.backend.repositories.playlists

import org.jooq.DSLContext
import org.jooq.Record
import org.mirea.backend.entities.playlists.PlaylistEntity
import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.entities.playlists.PlaylistWithAuthor
import org.mirea.backend.jooq.generated.Tables.PLAYLISTS
import org.mirea.backend.jooq.generated.tables.records.PlaylistsRecord
import org.mirea.backend.repositories.shared.authorMapper
import org.mirea.backend.repositories.shared.toAuthorEntity
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.UserID
import org.mirea.backend.utils.repositories.TableMapper
import org.springframework.stereotype.Component

@Component
class PlaylistMapper(
    dsl: DSLContext,
) : TableMapper<PlaylistEntity, PlaylistsRecord>(dsl) {
    override val updateIgnoreFields = setOf(PLAYLISTS.USER_ID)

    override fun map(entity: PlaylistEntity) = fields {
        if (entity.id != PlaylistID.EMPTY) {
            PLAYLISTS.ID set entity.id.value
        }
        PLAYLISTS.NAME set entity.name
        PLAYLISTS.PRIVACY_TYPE set entity.privacyType.value
        PLAYLISTS.USER_ID set entity.userID.value
    }
}

internal val playlistMapper = listOf(
    PLAYLISTS.ID,
    PLAYLISTS.NAME,
    PLAYLISTS.PRIVACY_TYPE,
    PLAYLISTS.USER_ID,
)

fun Record.toPlaylistEntity() = PlaylistEntity(
    id = PlaylistID(get(PLAYLISTS.ID)!!),
    name = get(PLAYLISTS.NAME)!!,
    privacyType = PrivacyType.from(get(PLAYLISTS.PRIVACY_TYPE)!!),
    userID = UserID(get(PLAYLISTS.USER_ID)!!),
)

internal val playlistWithAuthorMapper = playlistMapper + authorMapper

fun Record.toPlaylistWithAuthorEntity() = PlaylistWithAuthor(
    playlist = toPlaylistEntity(),
    author = toAuthorEntity(),
)
