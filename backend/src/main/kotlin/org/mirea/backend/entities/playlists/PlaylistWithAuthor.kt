package org.mirea.backend.entities.playlists

import org.mirea.backend.dto.playlists.PlaylistDto
import org.mirea.backend.entities.AuthorEntity

data class PlaylistWithAuthor(
    val playlist: PlaylistEntity,
    val author: AuthorEntity,
) {
    fun toDto() = PlaylistDto(
        id = playlist.id.value,
        name = playlist.name,
        privacyType = playlist.privacyType,
        author = author.toDto(),
    )
}