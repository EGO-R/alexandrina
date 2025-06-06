package org.mirea.backend.entities.video

import org.mirea.backend.dto.video.AuthorDto
import org.mirea.backend.dto.video.VideoDto
import org.mirea.backend.entities.AuthorEntity
import org.mirea.backend.utils.ids.UserID

data class VideoWithAuthor(
    val video:VideoEntity,
    val author: AuthorEntity,
) {
    fun toDto() = VideoDto(
        id = video.id.value,
        name = video.name,
        previewKey = video.preview,
        videoKey = video.videoUrl,
        privacyType = video.privacyType,
        author = AuthorDto(
            id = author.id.value,
            name = author.name,
        ),
    )
}