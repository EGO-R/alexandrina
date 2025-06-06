package org.mirea.backend.utils.ids

@JvmInline
value class VideoID(val value: Long) {
    companion object {
        val emptyId = 0L

        val EMPTY = VideoID(emptyId)
    }
}