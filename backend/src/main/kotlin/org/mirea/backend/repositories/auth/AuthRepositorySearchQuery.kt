package org.mirea.backend.repositories.auth

import org.mirea.backend.entities.auth.ProviderType
import org.mirea.backend.utils.ids.UserID

data class AuthRepositorySearchQuery internal constructor(
    val userId: UserID,
    val providerType: ProviderType?,
) {
    companion object {
        fun create(userId: UserID, cb: AuthRepositorySearchQueryBuilder.() -> Unit) =
            AuthRepositorySearchQueryBuilder(userId).apply(cb).build()

        class AuthRepositorySearchQueryBuilder(
            val userId: UserID,
        ) {
            var providerType: ProviderType? = null

            fun build() = AuthRepositorySearchQuery(
                userId = userId,
                providerType = providerType,
            )
        }
    }
}