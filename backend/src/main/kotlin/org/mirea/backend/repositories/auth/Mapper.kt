package org.mirea.backend.repositories.auth

import org.jooq.DSLContext
import org.mirea.backend.entities.auth.AuthEntity
import org.mirea.backend.jooq.generated.Tables.AUTH_PROVIDERS
import org.mirea.backend.jooq.generated.Tables.USERS
import org.mirea.backend.jooq.generated.tables.records.AuthProvidersRecord
import org.mirea.backend.utils.ids.AuthID
import org.mirea.backend.utils.repositories.TableMapper
import org.springframework.stereotype.Component

@Component
class AuthMapper(
    dsl: DSLContext,
) : TableMapper<AuthEntity, AuthProvidersRecord>(dsl) {
    override val updateIgnoreFields = setOf(AUTH_PROVIDERS.USER_ID, AUTH_PROVIDERS.PROVIDER_TYPE)

    override fun map(entity: AuthEntity) = fields {
        if (entity.id != AuthID.EMPTY) {
            AUTH_PROVIDERS.ID set entity.id.value
        }
        AUTH_PROVIDERS.USER_ID set entity.userId.value
        AUTH_PROVIDERS.PROVIDER_TYPE set entity.providerType.value
        AUTH_PROVIDERS.PROVIDER_USER_ID set entity.providerUserId
        AUTH_PROVIDERS.CREDENTIALS set entity.credentials
    }
}

internal val userAuthMapper = listOf(
    AUTH_PROVIDERS.ID,
    AUTH_PROVIDERS.USER_ID,
    AUTH_PROVIDERS.PROVIDER_TYPE,
    AUTH_PROVIDERS.PROVIDER_USER_ID,
    AUTH_PROVIDERS.CREDENTIALS,
    USERS.ID,
    USERS.EMAIL,
    USERS.NAME,
    USERS.ROLE,
    USERS.AVATAR,
)
