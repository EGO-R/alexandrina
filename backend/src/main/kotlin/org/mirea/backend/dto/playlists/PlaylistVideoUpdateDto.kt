package org.mirea.backend.dto.playlists

import org.mirea.backend.utils.ids.PlaylistID

data class PlaylistVideoUpdateDto(
    val playlistIds: List<PlaylistID>,
)