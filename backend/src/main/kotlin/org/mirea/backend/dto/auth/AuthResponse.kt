package org.mirea.backend.dto.auth

import org.mirea.backend.dto.user.UserDto

data class AuthResponse(
    val token: String,
    val user: UserDto,
)