package org.mirea.backend.config.auth

import kotlinx.coroutines.reactor.mono
import org.mirea.backend.services.user.UserService
import org.springframework.core.convert.converter.Converter
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import org.slf4j.LoggerFactory

@Component
class JwtToAuthConverter(
    private val userService: UserService,
) : Converter<Jwt, Mono<AbstractAuthenticationToken>> {
    private val logger = LoggerFactory.getLogger(JwtToAuthConverter::class.java)

    override fun convert(jwt: Jwt): Mono<AbstractAuthenticationToken> = mono {
        try {
            val user = userService.getByEmail(jwt.subject)
                ?: throw UsernameNotFoundException("User not found by email: ${jwt.subject}")

            UsernamePasswordAuthenticationToken(
                user,
                jwt,
                listOf(user.role),
            )
        } catch (e: Exception) {
            logger.error("Error converting JWT to authentication", e)
            throw e
        }
    }
}
