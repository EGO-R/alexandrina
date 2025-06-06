package org.mirea.backend.dto.video

import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.entities.video.VideoEntity

data class VideoUpdateDto(
    val name: String,
    val privacyType: PrivacyType,
) {
    fun toEntity(entity: VideoEntity) = VideoEntity(
        id = entity.id,
        name = name,
        userId = entity.userId,
        preview = entity.preview,
        videoUrl = entity.videoUrl,
        privacyType = privacyType,
    )
}