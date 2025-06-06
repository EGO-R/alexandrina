package org.mirea.backend.dto.playlists

import org.mirea.backend.dto.video.AuthorDto
import org.mirea.backend.entities.PrivacyType

data class PlaylistDto(
    val id: Long,
    val name: String,
    val privacyType: PrivacyType,
    val author: AuthorDto,
)