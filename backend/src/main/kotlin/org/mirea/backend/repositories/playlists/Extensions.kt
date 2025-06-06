package org.mirea.backend.repositories.playlists

import org.jooq.impl.DSL.noCondition
import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.jooq.generated.Tables.PLAYLISTS
import org.mirea.backend.repositories.playlists.queries.PlaylistRepositorySearchQuery
import org.mirea.backend.utils.repositories.*

fun PlaylistRepositorySearchQuery.toCondition() = noCondition()
    .andIn(PLAYLISTS.ID.asPlaylistID(), ids)
    .andEq(PLAYLISTS.USER_ID, userID?.value)
    .and {
        noCondition()
            .andEq(PLAYLISTS.PRIVACY_TYPE, PrivacyType.PUBLIC.value)
            .orEq(PLAYLISTS.USER_ID, currentUserId.value)
            .or(isAllAvailable)
    }
