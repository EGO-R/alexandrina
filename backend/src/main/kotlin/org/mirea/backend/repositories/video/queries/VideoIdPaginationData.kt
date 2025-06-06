package org.mirea.backend.repositories.video.queries

import org.jooq.TableField
import org.mirea.backend.jooq.generated.Tables.VIDEOS
import org.mirea.backend.jooq.generated.tables.records.VideosRecord
import org.mirea.backend.repositories.PaginationData
import org.mirea.backend.repositories.SortDirection
import org.mirea.backend.utils.ids.VideoID

data class VideoIdPaginationData internal constructor(
    override val direction: SortDirection,
    override val lastSelectedValue: Long?,
    override val size: Int?,
    override val field: TableField<VideosRecord, Long>,
) : PaginationData<VideosRecord, Long> {
    companion object {
        fun create(lastSelectedID: VideoID?, cb: VideoIdPaginationDataBuilder.() -> Unit) =
            VideoIdPaginationDataBuilder(lastSelectedID).apply(cb).build()

        class VideoIdPaginationDataBuilder(
            val lastSelectedID: VideoID?,
        ) {
            var size: Int? = null
            var sortDirection = SortDirection.ASC

            fun build() = VideoIdPaginationData(
                lastSelectedValue = lastSelectedID?.value,
                size = size,
                field = VIDEOS.ID,
                direction = sortDirection,
            )
        }
    }
}