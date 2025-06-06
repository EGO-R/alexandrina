package org.mirea.backend.entities.refresh

import org.mirea.backend.utils.ids.UserID
import java.time.LocalDateTime

data class RefreshTokenEntity(
    val userId: UserID,
    val tokenHash: String,
    val expiresAt: LocalDateTime,
)