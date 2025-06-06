package org.mirea.backend.repositories.auth

import org.mirea.backend.entities.auth.AuthEntity
import org.mirea.backend.entities.auth.ProviderType
import org.mirea.backend.entities.auth.UserWithAuthInfo
import org.mirea.backend.jooq.generated.Tables.*
import org.mirea.backend.repositories.JooqScope
import org.mirea.backend.utils.ids.UserID
import org.mirea.backend.utils.repositories.andEq
import org.springframework.stereotype.Repository

@Repository
class AuthRepository(
    private val jooqScope: JooqScope,
    private val mapper: AuthMapper,
) {

    suspend fun getByUserId(userId: UserID, providerType: ProviderType? = null): AuthEntity? =
        jooqScope.useDslContext { ctx ->
            ctx
                .selectFrom(AUTH_PROVIDERS)
                .where(
                    AUTH_PROVIDERS.USER_ID.eq(userId.value)
                        .andEq(AUTH_PROVIDERS.PROVIDER_TYPE, providerType?.value)
                )
                .fetchOne()
                ?.toEntity()
        }

    suspend fun create(authEntity: AuthEntity) =
        jooqScope.useDslContext { ctx ->
            ctx
                .insertInto(AUTH_PROVIDERS)
                .set(mapper.record(authEntity))
                .returning()
                .fetchOne()!!
                .toEntity()
        }

    suspend fun getAuthorityByEmail(email: String, type: ProviderType): AuthEntity? = jooqScope.useDslContext { ctx ->
        ctx
            .select(AUTH_PROVIDERS)
            .from(
                AUTH_PROVIDERS
                    .join(USERS).on(AUTH_PROVIDERS.USER_ID.eq(USERS.ID))
            )
            .where(
                USERS.EMAIL.eq(email)
                    .and(AUTH_PROVIDERS.PROVIDER_TYPE.eq(type.value))
            )
            .fetchOne()
            ?.value1()
            ?.toEntity()
    }

    suspend fun getUserWithAuthInfo(email: String, type: ProviderType): UserWithAuthInfo? = jooqScope.useDslContext { ctx ->
        ctx
            .select(userAuthMapper)
            .from(
                USERS
                    .join(AUTH_PROVIDERS).on(AUTH_PROVIDERS.USER_ID.eq(USERS.ID))
            )
            .where(
                USERS.EMAIL.eq(email)
                    .and(AUTH_PROVIDERS.PROVIDER_TYPE.eq(type.value))
                )
            .fetchOne()
            ?.toUserWithAuthEntity()
    }
}