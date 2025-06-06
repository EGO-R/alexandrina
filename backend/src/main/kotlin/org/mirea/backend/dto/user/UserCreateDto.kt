package org.mirea.backend.dto.user

import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.entities.user.UserRole
import org.mirea.backend.utils.ids.UserID

data class UserCreateDto(
    val name: String,
    val email: String,
    val role: UserRole = UserRole.USER,
    val avatarUrl: String? = null,
) {
    fun toEntity() = UserEntity(
        id = UserID.EMPTY,
        displayName = name,
        email = email,
        role = role,
        avatarUrl = avatarUrl,
    )
}