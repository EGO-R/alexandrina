package org.mirea.backend.repositories.refresh

import org.mirea.backend.entities.refresh.RefreshTokenEntity
import org.mirea.backend.jooq.generated.tables.records.RefreshTokensRecord
import org.mirea.backend.utils.ids.UserID

fun RefreshTokensRecord.toEntity() = RefreshTokenEntity(
    tokenHash = tokenHash,
    userId = UserID(userId),
    expiresAt = expiresAt,
)
