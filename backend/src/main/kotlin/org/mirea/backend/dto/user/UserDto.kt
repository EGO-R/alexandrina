package org.mirea.backend.dto.user

import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.utils.ids.UserID

data class UserDto(
    val id: UserID,
    val email: String,
    val name: String,
    val role: String,
    val avatarUrl: String?,
)

fun UserEntity.toDto() = UserDto(
    id, email, displayName, role.name, avatarUrl,
)
