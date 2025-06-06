package org.mirea.backend.utils.repositories

import org.jooq.Field
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.UserID

fun Field<Long>.asUserID() = this.convert(
    UserID::class.java,
    { UserID(it) },
    { it.value },
)

fun Field<Long>.asPlaylistID() = this.convert(
    PlaylistID::class.java,
    { PlaylistID(it) },
    { it.value },
)
