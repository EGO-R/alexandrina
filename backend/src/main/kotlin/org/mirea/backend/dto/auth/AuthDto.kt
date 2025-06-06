package org.mirea.backend.dto.auth

import org.mirea.backend.dto.user.UserDto
import java.time.Duration

data class AuthDto(
    val token: String,
    val refresh: String,
    val age: Duration,
    val user: UserDto,
)