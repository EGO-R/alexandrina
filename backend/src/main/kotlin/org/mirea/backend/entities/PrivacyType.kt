package org.mirea.backend.entities

enum class PrivacyType(val value: Int) {
    PUBLIC(0),
    PRIVATE(1),
    ;

    companion object {
        fun from(value: Int) =
            entries.find { it.value == value } ?: throw RuntimeException("Unknown PrivacyType: $value")
    }
}