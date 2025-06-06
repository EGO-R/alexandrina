package org.mirea.backend.utils.ids

@JvmInline
value class PlaylistID(val value: Long) {
    companion object {
        val emptyId = 0L

        val EMPTY = PlaylistID(emptyId)
    }
}