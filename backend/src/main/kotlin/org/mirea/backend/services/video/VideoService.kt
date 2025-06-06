package org.mirea.backend.services.video

import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import org.mirea.backend.dto.video.VideoCreateDto
import org.mirea.backend.dto.video.VideoDto
import org.mirea.backend.dto.video.VideoUpdateDto
import org.mirea.backend.dto.video.toDto
import org.mirea.backend.entities.user.UserRole
import org.mirea.backend.entities.video.VideoEntity
import org.mirea.backend.entities.video.VideoWithAuthor
import org.mirea.backend.exceptions.NoExistingVideoException
import org.mirea.backend.exceptions.VideoAlreadyExistsException
import org.mirea.backend.exceptions.VideoNotAvailableException
import org.mirea.backend.exceptions.VideoNotFoundException
import org.mirea.backend.repositories.video.VideoRepository
import org.mirea.backend.repositories.video.queries.VideoRepositorySearchQuery
import org.mirea.backend.services.ContextManager
import org.mirea.backend.services.DbTransactionManager
import org.mirea.backend.services.s3.S3Service
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.VideoID
import org.springframework.dao.DuplicateKeyException
import org.springframework.stereotype.Service

@Service
class VideoService(
    private val videoRepository: VideoRepository,
    private val s3Service: S3Service,
    private val transactionManager: DbTransactionManager,
    private val contextManager: ContextManager,
) {
    suspend fun getWithAuthorById(id: VideoID): VideoDto {
        val videoWithAuthor = videoRepository.getWithAuthorById(id) ?: throw NoExistingVideoException()
        checkVideoReadAccess(videoWithAuthor.video)
        return videoWithAuthor.toDto()
    }

    suspend fun getByIdSafe(id: VideoID): VideoEntity {
        val video = videoRepository.getById(id) ?: throw VideoNotFoundException(id)
        checkVideoReadAccess(video)
        return video
    }

    suspend fun searchWithAuthors(query: VideoSearchQuery): List<VideoDto> {
        val user = contextManager.getUser()

        val repositoryQuery = query.toRepositoryQuery(user)
        val videosWithAuthors = videoRepository.searchWithAuthors(repositoryQuery)

        return videosWithAuthors.map { it.toDto() }
    }

    suspend fun searchPlaylistVideos(id: PlaylistID): List<VideoWithAuthor> {
        val currentUser = contextManager.getUser()

        val query = VideoRepositorySearchQuery.create(currentUser) {}
        return videoRepository.getPlaylistVideos(id, query)
    }

    suspend fun create(dto: VideoCreateDto): VideoDto {
        val user = contextManager.getUser()
        val entity = VideoEntity(
            id = VideoID.EMPTY,
            userId = user.id,
            name = dto.name,
            preview = dto.previewUrl,
            videoUrl = dto.videoUrl,
            privacyType = dto.privacyType,
        )
        try {
            return upsert(entity).toDto(user)
        } catch (e: DuplicateKeyException) {
            throw VideoAlreadyExistsException()
        }
    }

    suspend fun update(id: VideoID, dto: VideoUpdateDto): VideoDto {
        val videoWithAuthor = videoRepository.getWithAuthorById(id) ?: throw NoExistingVideoException()
        checkVideoEditAccess(videoWithAuthor.video)
        val newVideo = dto.toEntity(videoWithAuthor.video)
        val createdVideo = upsert(newVideo)
        return videoWithAuthor.copy(video = createdVideo).toDto()
    }

    private suspend fun upsert(video: VideoEntity): VideoEntity {
        return videoRepository.upsert(video)
    }

    suspend fun deleteById(id: VideoID) {
        val video = getByIdSafe(id)
        checkVideoEditAccess(video)

        coroutineScope {
            launch {
                s3Service.deleteFile(video.preview)
            }
            launch {
                s3Service.deleteFile(video.videoUrl)
            }
            launch {
                videoRepository.delete(id)
            }
        }
    }

    private suspend fun checkVideoEditAccess(video: VideoEntity) {
        val user = contextManager.getUser()
        takeIf { video.userId == user.id || user.role == UserRole.ADMIN } ?: throw VideoNotAvailableException(video.id)
    }

    private suspend fun checkVideoReadAccess(video: VideoEntity) {
        takeIf { video.isPublic() } ?: checkVideoEditAccess(video)
    }
}