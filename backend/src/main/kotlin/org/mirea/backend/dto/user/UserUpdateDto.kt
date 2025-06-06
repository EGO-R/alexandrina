package org.mirea.backend.dto.user

data class UserUpdateDto(
    val displayName: String,
    val role: String,
    val avatarUrl: String?,
)