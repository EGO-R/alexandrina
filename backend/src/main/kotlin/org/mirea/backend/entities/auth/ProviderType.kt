package org.mirea.backend.entities.auth

enum class ProviderType(val value: Int) {
    PASSWORD(0),
    GOOGLE(1),
    ;

    companion object {
        fun from(value: Int) = entries.find { it.value == value } ?: throw RuntimeException("Unknown auth entity type: $value")
    }
}
