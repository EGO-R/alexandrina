package org.mirea.backend.repositories

enum class SortDirection {
    ASC,
    DESC,
    ;

    companion object {
        fun from(value: String?) = entries.find { it.name == value } ?: ASC
    }
}