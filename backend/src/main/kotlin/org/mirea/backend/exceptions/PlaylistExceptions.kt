package org.mirea.backend.exceptions

import org.mirea.backend.utils.ids.PlaylistID

class PlaylistNotFoundException(id: PlaylistID) : RuntimeException(
    "Playlist ${id.value} not found"
)

class PlaylistNotAvailableException(id: PlaylistID) : RuntimeException(
    "Playlist ${id.value} not available"
)

class WrongPlaylistsException(ids: Collection<PlaylistID>) : RuntimeException(
    "Wrong playlist ids (${ids.joinToString()})"
)
