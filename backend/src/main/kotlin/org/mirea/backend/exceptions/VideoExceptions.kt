package org.mirea.backend.exceptions

import org.mirea.backend.dto.video.VideoCreateDto
import org.mirea.backend.utils.ids.VideoID

class NoExistingVideoException : ValidationException("No existing video exception")

class VideoNotFoundException(videoID: VideoID) : RuntimeException(
    "Video ${videoID.value} not found"
)

class VideoAlreadyExistsException : RuntimeException(
    "Video already exists"
)

class VideoNotAvailableException(videoID: VideoID) : RuntimeException(
    "Video ${videoID.value} is not available"
)
