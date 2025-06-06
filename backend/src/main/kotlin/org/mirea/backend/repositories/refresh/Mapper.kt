package org.mirea.backend.repositories.refresh

import org.jooq.DSLContext
import org.jooq.TableField
import org.mirea.backend.entities.refresh.RefreshTokenEntity
import org.mirea.backend.jooq.generated.Tables.REFRESH_TOKENS
import org.mirea.backend.jooq.generated.tables.records.RefreshTokensRecord
import org.mirea.backend.utils.repositories.TableMapper
import org.springframework.stereotype.Component

@Component
class RefreshMapper(
    dsl: DSLContext,
) : TableMapper<RefreshTokenEntity, RefreshTokensRecord>(dsl) {
    override val updateIgnoreFields = setOf(
        REFRESH_TOKENS.USER_ID,
    )

    override fun map(entity: RefreshTokenEntity): Map<TableField<RefreshTokensRecord, *>, *> = fields {
        REFRESH_TOKENS.TOKEN_HASH set entity.tokenHash
        REFRESH_TOKENS.USER_ID set entity.userId.value
        REFRESH_TOKENS.EXPIRES_AT set entity.expiresAt
    }
}
