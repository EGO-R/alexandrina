package org.mirea.backend.controllers

import com.nimbusds.oauth2.sdk.TokenResponse
import org.mirea.backend.dto.auth.AuthDto
import org.mirea.backend.dto.auth.AuthRequest
import org.mirea.backend.dto.auth.AuthResponse
import org.mirea.backend.dto.user.UserDto
import org.mirea.backend.exceptions.UserAlreadyExistsException
import org.mirea.backend.services.auth.AuthService
import org.mirea.backend.services.user.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseCookie
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.bind.annotation.*
import org.springframework.web.client.HttpClientErrorException
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/api/auth")
class AuthController(
    private val authService: AuthService,
    private val userService: UserService,
) {
    @PostMapping("/register")
    suspend fun register(@RequestBody req: AuthRequest,
                         response: ServerHttpResponse): AuthResponse =
        try {
            val authDto = authService.register(req)
            response.setRefreshCookie(authDto)
            AuthResponse(
                token = authDto.token,
                user = authDto.user,
            )
        } catch (e: UserAlreadyExistsException) {
            throw ResponseStatusException(HttpStatus.BAD_REQUEST, e.message)
        }

    @PostMapping("/login")
    suspend fun login(@RequestBody req: AuthRequest,
                      response: ServerHttpResponse): AuthResponse {
        val authDto = authService.login(req)
        response.setRefreshCookie(authDto)
        return AuthResponse(
            token = authDto.token,
            user = authDto.user,
        )
    }

    @PostMapping("/refresh")
    suspend fun refresh(@CookieValue("refresh_token") refreshRaw: String?, response: ServerHttpResponse): AuthResponse {
        if (refreshRaw == null) throw ResponseStatusException(HttpStatus.UNAUTHORIZED)

        val authDto = authService.rotate(refreshRaw)
        response.setRefreshCookie(authDto)
        return AuthResponse(
            token = authDto.token,
            user = authDto.user,
        )
    }

    @GetMapping("/me")
    suspend fun getCurrentUser(): UserDto = userService.getCurrent()

    private fun ServerHttpResponse.setRefreshCookie(authDto: AuthDto) {
        addCookie(
            ResponseCookie.from("refresh_token", authDto.refresh)
                .httpOnly(true).secure(true)
                .sameSite("Lax").path("/api/auth/refresh")
                .maxAge(authDto.age)
                .build()
        )
    }
}
