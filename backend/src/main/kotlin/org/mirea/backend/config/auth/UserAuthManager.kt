package org.mirea.backend.config.auth

import kotlinx.coroutines.reactor.mono
import org.mirea.backend.entities.auth.ProviderType
import org.mirea.backend.repositories.auth.AuthRepository
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono

@Component
class UserAuthManager(
    private val authRepository: AuthRepository,
    private val encoder: PasswordEncoder
) : ReactiveAuthenticationManager {

    override fun authenticate(auth: Authentication): Mono<Authentication> = mono {
        val email = auth.principal as String
        val raw   = auth.credentials as String

        val userWithAuthInfo = authRepository.getUserWithAuthInfo(email, ProviderType.PASSWORD)
            ?: throw BadCredentialsException("User not found")
        if (!encoder.matches(raw, userWithAuthInfo.authInfo.credentials)) {
            throw BadCredentialsException("Bad credentials")
        }
        UsernamePasswordAuthenticationToken(
            userWithAuthInfo.user,
            null,
            listOf(userWithAuthInfo.user.role),
        )
    }
}
