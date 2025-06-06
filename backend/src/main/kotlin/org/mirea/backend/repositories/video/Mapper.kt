package org.mirea.backend.repositories.video

import org.jooq.DSLContext
import org.jooq.Record
import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.entities.video.VideoEntity
import org.mirea.backend.entities.video.VideoWithAuthor
import org.mirea.backend.jooq.generated.Tables.USERS
import org.mirea.backend.jooq.generated.Tables.VIDEOS
import org.mirea.backend.jooq.generated.tables.records.VideosRecord
import org.mirea.backend.repositories.shared.authorMapper
import org.mirea.backend.repositories.shared.toAuthorEntity
import org.mirea.backend.utils.ids.UserID
import org.mirea.backend.utils.ids.VideoID
import org.mirea.backend.utils.repositories.TableMapper
import org.springframework.stereotype.Component

@Component
class VideoMapper(
    dsl: DSLContext,
) : TableMapper<VideoEntity, VideosRecord>(dsl) {
    override val updateIgnoreFields = setOf(VIDEOS.USER_ID)

    override fun map(entity: VideoEntity) = fields {
        if (entity.id != VideoID.EMPTY) {
            VIDEOS.ID set entity.id.value
        }
        VIDEOS.NAME set entity.name
        VIDEOS.USER_ID set entity.userId.value
        VIDEOS.PREVIEW set entity.preview
        VIDEOS.VIDEO_URL set entity.videoUrl
        VIDEOS.PRIVACY_TYPE set entity.privacyType.value
    }
}

internal val videoMapper = listOf(
    VIDEOS.ID,
    VIDEOS.NAME,
    VIDEOS.USER_ID,
    VIDEOS.PREVIEW,
    VIDEOS.VIDEO_URL,
    VIDEOS.PRIVACY_TYPE,
)

fun Record.toVideoEntity() = VideoEntity(
    id = VideoID(get(VIDEOS.ID)!!),
    name = get(VIDEOS.NAME)!!,
    userId = UserID(get(VIDEOS.USER_ID)!!),
    preview = get(VIDEOS.PREVIEW)!!,
    videoUrl = get(VIDEOS.VIDEO_URL)!!,
    privacyType = PrivacyType.from(get(VIDEOS.PRIVACY_TYPE)!!),
)

internal val videoWithAuthorMapper = videoMapper + authorMapper

fun Record.toVideoWithAuthor() = VideoWithAuthor(
    video = toVideoEntity(),
    author = toAuthorEntity(),
)
