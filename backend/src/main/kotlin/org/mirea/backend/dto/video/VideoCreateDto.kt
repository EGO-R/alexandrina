package org.mirea.backend.dto.video

import org.mirea.backend.entities.PrivacyType

data class VideoCreateDto(
    val name: String,
    val previewUrl: String,
    val videoUrl: String,
    val privacyType: PrivacyType,
)