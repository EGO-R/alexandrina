package org.mirea.backend.services.auth

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.mirea.backend.dto.auth.AuthDto
import org.mirea.backend.dto.user.toDto
import org.mirea.backend.entities.refresh.RefreshTokenEntity
import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.repositories.refresh.RefreshTokenRepository
import org.mirea.backend.services.DbTransactionManager
import org.mirea.backend.services.user.UserService
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.CredentialsExpiredException
import org.springframework.stereotype.Service
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Clock
import java.time.Duration
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.*

@Service
class JwtService(
    @Value("\${jwt.secret}") secret: String,
    private val refreshRepository: RefreshTokenRepository,
    private val userService: UserService,
    private val transactionManager: DbTransactionManager,
    private val clock: Clock = Clock.systemUTC()
) {
    private val key = Keys.hmacShaKeyFor(secret.toByteArray())
    private val defaultTokenDuration = Duration.of(30, ChronoUnit.MINUTES)
    private val random = SecureRandom()
    val defaultRefreshTokenDuration = Duration.of(30, ChronoUnit.DAYS)

    suspend fun generatePair(user: UserEntity): AuthDto {
        // 1. access
        val token = generate(user, defaultTokenDuration)

        // 2. refresh – криптографически случайная строка
        val refreshRaw = ByteArray(64).also { random.nextBytes(it) }.toHex()
        val hash = sha256(refreshRaw)

        refreshRepository.upsert(
            RefreshTokenEntity(
                tokenHash = hash,
                userId = user.id,
                expiresAt = LocalDateTime.now(clock).plus(defaultRefreshTokenDuration),
            )
        )
        return AuthDto(
            token = token,
            refresh = refreshRaw,
            age = defaultRefreshTokenDuration,
            user = user.toDto(),
        )
    }

    suspend fun rotate(refreshRaw: String): AuthDto = transactionManager.transactional {
        val saved = refreshRepository.searchByToken(sha256(refreshRaw))
            ?: throw BadCredentialsException("Refresh not found")

        if (saved.expiresAt.isBefore(LocalDateTime.now()))
            throw CredentialsExpiredException("Refresh expired")

        val user = userService.getById(saved.userId)!!

        generatePair(user)
    }

    private suspend fun generate(user: UserEntity, ttl: Duration = defaultTokenDuration): String =
        Jwts.builder()
            .subject(user.email)
            .issuedAt(Date.from(clock.instant()))
            .expiration(Date.from(clock.instant().plus(ttl)))
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()

    private fun ByteArray.toHex() = joinToString("") { "%02x".format(it) }
    private fun sha256(str: String) =
        MessageDigest.getInstance("SHA-256").digest(str.toByteArray()).toHex()
}
