package org.mirea.backend.entities.auth

import org.mirea.backend.utils.ids.AuthID
import org.mirea.backend.utils.ids.UserID

data class AuthEntity(
    val id: AuthID = AuthID.EMPTY,
    val userId: UserID,
    val providerType: ProviderType,
    val providerUserId: Long?,
    val credentials: String,
)
