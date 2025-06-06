package org.mirea.backend.dto.playlists

import org.mirea.backend.dto.video.VideoDto

data class PlaylistWithVideosDto(
    val playlist: PlaylistDto,
    val videos: List<VideoDto>,
) {
}