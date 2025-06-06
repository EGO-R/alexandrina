package org.mirea.backend.config.auth

import kotlinx.coroutines.reactor.mono
import org.mirea.backend.dto.user.UserCreateDto
import org.mirea.backend.entities.auth.AuthEntity
import org.mirea.backend.entities.auth.ProviderType
import org.mirea.backend.entities.user.UserRole
import org.mirea.backend.repositories.auth.AuthRepository
import org.mirea.backend.services.DbTransactionManager
import org.mirea.backend.services.auth.JwtService
import org.mirea.backend.services.user.UserService
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.security.web.server.WebFilterExchange
import org.springframework.security.web.server.authentication.ServerAuthenticationSuccessHandler
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import java.net.URI
import org.slf4j.LoggerFactory

@Component
class OAuth2LoginSuccessHandler(
    private val userService: UserService,
    private val authRepository: AuthRepository,
    private val jwtService: JwtService,
    private val transactionManager: DbTransactionManager
) : ServerAuthenticationSuccessHandler {
    private val logger = LoggerFactory.getLogger(OAuth2LoginSuccessHandler::class.java)

    override fun onAuthenticationSuccess(
        webFilterExchange: WebFilterExchange,
        authentication: Authentication
    ): Mono<Void> = mono {
        try {
            val oAuth2User = authentication.principal as OAuth2User
            val oauthToken = authentication as OAuth2AuthenticationToken
            val provider = when (oauthToken.authorizedClientRegistrationId) {
                "google" -> ProviderType.GOOGLE
                else -> throw IllegalArgumentException("Unsupported OAuth provider")
            }
            
            logger.info("OAuth login success for provider: ${oauthToken.authorizedClientRegistrationId}")
            
            val attributes = oAuth2User.attributes
            logger.debug("OAuth user attributes: $attributes")
            
            val email = attributes["email"] as? String
                ?: throw IllegalArgumentException("Email not provided by OAuth provider")
            
            val name = attributes["name"] as? String
                ?: email.substringBefore("@") // Fallback to using part of email if name not provided
            
            val providerId = try {
                (attributes["sub"] as String).toLongOrNull()
            } catch (e: Exception) {
                logger.warn("Failed to parse provider ID", e)
                null // We'll proceed without provider ID if necessary
            }

            // Check if user exists with this email
            logger.debug("Checking if user exists with email: $email")
            var user = userService.getByEmail(email)
            
            if (user == null) {
                logger.info("Creating new user for email: $email")
                // Create new user
                user = transactionManager.transactional {
                    val newUser = userService.create(
                        UserCreateDto(
                            email = email,
                            name = name,
                            role = UserRole.USER,
                            avatarUrl = null,
                        )
                    )
                    
                    // Create auth provider entry
                    authRepository.create(
                        AuthEntity(
                            userId = newUser.id,
                            providerType = provider,
                            providerUserId = providerId,
                            credentials = "" // Not needed for OAuth
                        )
                    )
                    
                    newUser
                }
            } else {
                logger.debug("User found with email: $email")
                // Check if the provider is already connected, if not, connect it
                val existingAuth = authRepository.getByUserId(user.id, provider)
                if (existingAuth == null) {
                    logger.debug("Connecting provider to existing user")
                    authRepository.create(
                        AuthEntity(
                            userId = user.id,
                            providerType = provider,
                            providerUserId = providerId,
                            credentials = "" // Not needed for OAuth
                        )
                    )
                }
            }
            
            // Generate JWT tokens
            logger.debug("Generating JWT tokens for user: ${user.id}")
            val authDto = jwtService.generatePair(user)
            
            // Redirect to frontend with token
            val response = webFilterExchange.exchange.response
            redirectWithToken(response, authDto.token, authDto.refresh)
            
            null
        } catch (e: Exception) {
            logger.error("Error during OAuth authentication", e)
            // Redirect to error page on frontend
            val response = webFilterExchange.exchange.response
            redirectToError(response, "Authentication failed: ${e.message}")
            null
        }
    }
    
    private fun redirectWithToken(response: ServerHttpResponse, token: String, refreshToken: String) {
        // Redirect to your frontend application with the token
        val redirectUri = URI.create("http://localhost:3000/auth-callback?token=$token&refresh=$refreshToken")
        logger.info("Redirecting to: $redirectUri")
        response.statusCode = org.springframework.http.HttpStatus.FOUND
        response.headers.location = redirectUri
    }
    
    private fun redirectToError(response: ServerHttpResponse, errorMessage: String) {
        val encodedError = java.net.URLEncoder.encode(errorMessage, "UTF-8")
        val redirectUri = URI.create("http://localhost:3000/login?error=$encodedError")
        logger.info("Redirecting to error page: $redirectUri")
        response.statusCode = org.springframework.http.HttpStatus.FOUND
        response.headers.location = redirectUri
    }
} 