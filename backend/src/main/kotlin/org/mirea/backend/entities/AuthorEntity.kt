package org.mirea.backend.entities

import org.mirea.backend.dto.video.AuthorDto
import org.mirea.backend.utils.ids.UserID

data class AuthorEntity(
    val id: UserID,
    val name: String,
) {
    fun toDto() = AuthorDto(
        id = id.value,
        name = name,
    )
}