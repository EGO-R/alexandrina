package org.mirea.backend.services

import kotlinx.coroutines.reactor.awaitSingle
import org.mirea.backend.entities.user.UserEntity
import org.springframework.security.core.context.ReactiveSecurityContextHolder
import org.springframework.stereotype.Component

@Component
class ContextManager {
    suspend fun getUser(): UserEntity = ReactiveSecurityContextHolder.getContext()
            .map { it.authentication.principal }
            .cast(UserEntity::class.java)
            .awaitSingle()
}