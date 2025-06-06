package org.mirea.backend.entities.auth

import org.mirea.backend.entities.user.UserEntity

data class UserWithAuthInfo(
    val user: UserEntity,
    val authInfo: AuthEntity,
)