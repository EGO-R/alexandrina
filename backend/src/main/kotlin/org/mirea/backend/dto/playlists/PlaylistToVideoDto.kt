package org.mirea.backend.dto.playlists

data class PlaylistToVideoDto(
    val playlist: PlaylistDto,
    val isContainsVideo: Boolean,
)