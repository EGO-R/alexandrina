package org.mirea.backend.dto.auth

data class AuthRequest(
    val email: String,
    val password: String,
)
