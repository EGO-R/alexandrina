package org.mirea.backend.config.auth

import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.security.authentication.AbstractAuthenticationToken
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.config.web.server.invoke
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.oauth2.client.registration.ClientRegistration
import org.springframework.security.oauth2.client.registration.InMemoryReactiveClientRegistrationRepository
import org.springframework.security.oauth2.client.registration.ReactiveClientRegistrationRepository
import org.springframework.security.oauth2.core.AuthorizationGrantType
import org.springframework.security.oauth2.core.ClientAuthenticationMethod
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames
import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.security.oauth2.jwt.NimbusReactiveJwtDecoder
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers.pathMatchers
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsConfigurationSource
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import reactor.core.publisher.Mono
import org.springframework.security.web.server.ServerAuthenticationEntryPoint
import org.springframework.security.web.server.authentication.RedirectServerAuthenticationEntryPoint
import org.springframework.security.web.server.authentication.HttpStatusServerEntryPoint


@Configuration
@EnableWebFluxSecurity
//@EnableMethodSecurity
class SecurityConfig {
    @Value("\${spring.security.oauth2.client.registration.google.client-id}")
    private lateinit var clientId: String
    @Value("\${spring.security.oauth2.client.registration.google.client-secret}")
    private lateinit var clientSecret: String

    @Bean
    fun chain(
        http: ServerHttpSecurity,
        cors: CorsConfigurationSource,
        converter: Converter<Jwt, Mono<AbstractAuthenticationToken>>,
        oAuth2LoginSuccessHandler: OAuth2LoginSuccessHandler,
    ): SecurityWebFilterChain = http {
        cors { configurationSource = cors }
        csrf { disable() }
        authorizeExchange {
            authorize(
                pathMatchers(HttpMethod.OPTIONS, "/**"),
                permitAll,
            )
            authorize("/api/auth/**", permitAll)
            authorize("/login/oauth2/code/**", permitAll)
            authorize("/oauth2/authorization/**", permitAll)
            authorize(anyExchange, authenticated)
        }

        exceptionHandling {
            authenticationEntryPoint = authenticationEntryPoint()
        }

        oauth2ResourceServer {
            jwt { jwtAuthenticationConverter = converter }
        }
        
        oauth2Login {
            authenticationSuccessHandler = oAuth2LoginSuccessHandler
//            authenticationFailureHandler = oAuth2LoginFailureHandler
        }
    }

    @Bean
    fun authenticationEntryPoint(): ServerAuthenticationEntryPoint {
        // For OAuth login endpoints, redirect to login
        val oauthLoginMatcher = pathMatchers("/oauth2/authorization/**")
        val redirectEntryPoint = RedirectServerAuthenticationEntryPoint("/oauth2/authorization/google")

        // For all other endpoints, return 401
        val statusEntryPoint = HttpStatusServerEntryPoint(HttpStatus.UNAUTHORIZED)

        return ServerAuthenticationEntryPoint { serverWebExchange, exception ->
            // Use a reactive approach to check if the path matches OAuth pattern
            oauthLoginMatcher.matches(serverWebExchange)
                .flatMap { matchResult ->
                    if (matchResult.isMatch) {
                        redirectEntryPoint.commence(serverWebExchange, exception)
                    } else {
                        statusEntryPoint.commence(serverWebExchange, exception)
                    }
                }
        }
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource =
        UrlBasedCorsConfigurationSource().apply {
            registerCorsConfiguration("/**", CorsConfiguration().apply {
                allowedOrigins = listOf("http://localhost:3000", "https://accounts.google.com")
                allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
                allowedHeaders = listOf("*")
                allowCredentials = true
                maxAge = 3600
            })
        }


    @Bean
    fun jwtDecoder(@Value("\${jwt.secret}") secret: String): ReactiveJwtDecoder =
        NimbusReactiveJwtDecoder
            .withSecretKey(Keys.hmacShaKeyFor(secret.toByteArray()))
            .macAlgorithm(MacAlgorithm.HS256)
            .build()

    @Bean
    fun passwordEncoder(): PasswordEncoder = BCryptPasswordEncoder()

    @Bean
    fun clientRegistrations(): ReactiveClientRegistrationRepository {
        val googleRegistration = ClientRegistration.withRegistrationId("google")
            .clientId(clientId)
            .clientSecret(clientSecret)
            .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
            .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
            .redirectUri("{baseUrl}/login/oauth2/code/{registrationId}")
            .scope("email", "profile")
            // Force account selection by adding prompt=select_account parameter
            .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth?prompt=select_account")
            .tokenUri("https://www.googleapis.com/oauth2/v4/token")
            .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
            .userNameAttributeName(IdTokenClaimNames.SUB)
            .clientName("Google")
            .build()

        return InMemoryReactiveClientRegistrationRepository(listOf(googleRegistration))
    }
}

