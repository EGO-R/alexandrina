package org.mirea.backend.services.auth

import kotlinx.coroutines.reactor.awaitSingle
import org.mirea.backend.dto.auth.AuthDto
import org.mirea.backend.dto.auth.AuthRequest
import org.mirea.backend.dto.user.UserCreateDto
import org.mirea.backend.entities.auth.AuthEntity
import org.mirea.backend.entities.auth.ProviderType
import org.mirea.backend.exceptions.UserAlreadyExistsException
import org.mirea.backend.exceptions.UserEmailNotFoundException
import org.mirea.backend.repositories.auth.AuthRepository
import org.mirea.backend.services.DbTransactionManager
import org.mirea.backend.services.user.UserService
import org.springframework.security.authentication.ReactiveAuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val authManager: ReactiveAuthenticationManager,
    private val passwordEncoder: PasswordEncoder,
    private val userService: UserService,
    private val authRepository: AuthRepository,
    private val transactionManager: DbTransactionManager,
    private val jwtService: JwtService,
) {
    suspend fun register(req: AuthRequest): AuthDto = transactionManager.transactional {
        val existingUser = userService.getByEmail(req.email)

        if (existingUser != null) {
            throw UserAlreadyExistsException(existingUser.email)
        }

        val user = userService.create(
            UserCreateDto(
                email = req.email,
                name = req.email.substringBefore("@"),
                avatarUrl = null,
            )
        )

        val credentials = passwordEncoder.encode(req.password)
        val authProvider = AuthEntity(
            providerType = ProviderType.PASSWORD,
            credentials = credentials,
            userId = user.id,
            providerUserId = null,
        )
        authRepository.create(authProvider)
        jwtService.generatePair(user)
    }

    suspend fun login(req: AuthRequest): AuthDto {
        val auth = UsernamePasswordAuthenticationToken(req.email, req.password)
        authManager.authenticate(auth).awaitSingle()
        val user = userService.getByEmail(req.email) ?: throw UserEmailNotFoundException(req.email)

        return jwtService.generatePair(user)
    }

    suspend fun rotate(refreshRaw: String) = jwtService.rotate(refreshRaw)
}