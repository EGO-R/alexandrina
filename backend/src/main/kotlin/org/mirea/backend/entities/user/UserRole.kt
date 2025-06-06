package org.mirea.backend.entities.user

import org.springframework.security.core.GrantedAuthority

enum class UserRole(val value: Short) : GrantedAuthority {
    USER(0),
    ADMIN(1),
    ;

    override fun getAuthority(): String = "ROLE_$name"

    companion object {
        fun from(value: Short) = entries.find { it.value == value } ?: throw RuntimeException("Unknown auth entity type: $value")
    }
}