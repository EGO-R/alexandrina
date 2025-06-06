package org.mirea.backend.repositories.auth

import org.jooq.Record
import org.mirea.backend.entities.auth.AuthEntity
import org.mirea.backend.entities.auth.ProviderType
import org.mirea.backend.entities.auth.UserWithAuthInfo
import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.entities.user.UserRole
import org.mirea.backend.jooq.generated.Tables.AUTH_PROVIDERS
import org.mirea.backend.jooq.generated.Tables.USERS
import org.mirea.backend.jooq.generated.tables.records.AuthProvidersRecord
import org.mirea.backend.utils.ids.AuthID
import org.mirea.backend.utils.ids.UserID

fun AuthProvidersRecord.toEntity() = AuthEntity(
    id = AuthID(get(AUTH_PROVIDERS.ID)!!),
    userId = UserID(get(AUTH_PROVIDERS.USER_ID)!!),
    providerType = ProviderType.from(get(AUTH_PROVIDERS.PROVIDER_TYPE)!!),
    providerUserId = get(AUTH_PROVIDERS.PROVIDER_USER_ID),
    credentials = get(AUTH_PROVIDERS.CREDENTIALS)!!,
)

fun Record.toUserWithAuthEntity() = UserWithAuthInfo(
    user = UserEntity(
        id = UserID(get(USERS.ID)!!),
        displayName = get(USERS.NAME)!!,
        email = get(USERS.EMAIL)!!,
        role = UserRole.from(get(USERS.ROLE)),
        avatarUrl = get(USERS.AVATAR),
    ),
    authInfo = AuthEntity(
        id = AuthID(get(AUTH_PROVIDERS.ID)!!),
        userId = UserID(get(AUTH_PROVIDERS.USER_ID)!!),
        providerType = ProviderType.from(get(AUTH_PROVIDERS.PROVIDER_TYPE)!!),
        providerUserId = get(AUTH_PROVIDERS.PROVIDER_USER_ID),
        credentials = get(AUTH_PROVIDERS.CREDENTIALS)!!,
    ),
)
