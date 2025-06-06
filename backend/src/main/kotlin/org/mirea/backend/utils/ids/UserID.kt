package org.mirea.backend.utils.ids

@JvmInline
value class UserID(val value: Long) {
    companion object {
        val emptyId = 0L

        val EMPTY = UserID(emptyId)
    }
}