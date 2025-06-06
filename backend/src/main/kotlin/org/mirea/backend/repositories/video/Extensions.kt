package org.mirea.backend.repositories.video

import org.jooq.impl.DSL.noCondition
import org.mirea.backend.entities.PrivacyType
import org.mirea.backend.jooq.generated.Tables.VIDEOS
import org.mirea.backend.repositories.video.queries.VideoRepositorySearchQuery
import org.mirea.backend.utils.repositories.*

fun VideoRepositorySearchQuery.toCondition() = noCondition()
    .andLike(VIDEOS.NAME, name)
    .andEq(VIDEOS.USER_ID, userID?.value)
    .and {
        noCondition()
            .andEq(VIDEOS.PRIVACY_TYPE, PrivacyType.PUBLIC.value)
            .orEq(VIDEOS.USER_ID, currentUserId.value)
            .or(isAllAvailable)
    }
