package org.mirea.backend.repositories.user

import org.mirea.backend.utils.ids.UserID
import software.amazon.awssdk.services.identitystore.model.Email

data class UserRepositorySearchQuery internal constructor(
    val ids: Set<UserID>?,
    val email: String?,
) {
    companion object {
        fun create(cb: UserRepositorySearchQueryBuilder.() -> Unit) =
            UserRepositorySearchQueryBuilder().apply(cb).build()

        class UserRepositorySearchQueryBuilder {
            var ids: Set<UserID>? = null
            var email: String? = null

            fun build() = UserRepositorySearchQuery(
                ids = ids,
                email = email,
            )
        }
    }
}