package org.mirea.backend.utils.ids

@JvmInline
value class AuthID(val value: Long) {
    companion object {
        val emptyId = 0L

        val EMPTY = AuthID(emptyId)
    }
}