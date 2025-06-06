package org.mirea.backend.dto.video

import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.entities.video.VideoEntity

data class VideoDto(
    val id: Long,
    val name: String,
    val previewKey: String,
    val videoKey: String,
    val privacyType: PrivacyType,
    val author: AuthorDto,
)

fun VideoEntity.toDto(author: UserEntity) = VideoDto(
    id = id.value,
    name = name,
    previewKey = preview,
    videoKey = videoUrl,
    privacyType = privacyType,
    author = author.toAuthorDto(),
)
