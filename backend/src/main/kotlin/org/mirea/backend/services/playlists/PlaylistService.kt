package org.mirea.backend.services.playlists

import org.mirea.backend.dto.playlists.*
import org.mirea.backend.entities.playlists.PlaylistEntity
import org.mirea.backend.entities.playlists.PlaylistWithAuthor
import org.mirea.backend.entities.user.UserRole
import org.mirea.backend.exceptions.PlaylistNotAvailableException
import org.mirea.backend.exceptions.PlaylistNotFoundException
import org.mirea.backend.exceptions.WrongPlaylistsException
import org.mirea.backend.repositories.playlists.PlaylistsRepository
import org.mirea.backend.repositories.playlists.queries.PlaylistRepositorySearchQuery
import org.mirea.backend.services.ContextManager
import org.mirea.backend.services.DbTransactionManager
import org.mirea.backend.services.video.VideoService
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.UserID
import org.mirea.backend.utils.ids.VideoID
import org.springframework.stereotype.Service

@Service
class PlaylistService(
    private val playlistsRepository: PlaylistsRepository,
    private val contextManager: ContextManager,
    private val videoService: VideoService,
    private val transactionManager: DbTransactionManager,
) {
    suspend fun getByIdSafe(id: PlaylistID): PlaylistEntity {
        val playlist = playlistsRepository.getById(id) ?: throw PlaylistNotFoundException(id)
        checkReadAccess(playlist)
        return playlist
    }

    suspend fun getWithAuthorByIdSafe(id: PlaylistID): PlaylistWithAuthor {
        val playlistWithAuthor = playlistsRepository.getByIdWithAuthor(id) ?: throw PlaylistNotFoundException(id)
        checkReadAccess(playlistWithAuthor.playlist)
        return playlistWithAuthor
    }

    suspend fun search(userId: UserID): List<PlaylistWithAuthor> {
        val currentUser = contextManager.getUser()

        val query = PlaylistRepositorySearchQuery.create(currentUser) {
            userID = userId
        }
        return playlistsRepository.searchPlaylistWithAuthor(query)
    }

    suspend fun create(dto: PlaylistCreateUpdateDto): PlaylistWithVideosDto {
        val currentUser = contextManager.getUser()

        val requestEntity = dto.toEntity(authorId = currentUser.id)
        val createdEntity = playlistsRepository.upsert(requestEntity)
        val playlistWithAuthor = playlistsRepository.getByIdWithAuthor(createdEntity.id)!!
        return PlaylistWithVideosDto(
            playlist = playlistWithAuthor.toDto(),
            videos = emptyList(),
        )
    }

    suspend fun update(id: PlaylistID, dto: PlaylistCreateUpdateDto): PlaylistWithVideosDto {
        val existingPlaylist = getByIdSafe(id)
        checkEditAccess(existingPlaylist)

        val newPlaylist = dto.toEntity(existingPlaylist)
        playlistsRepository.upsert(newPlaylist)
        return getPlaylistWithVideos(id)
    }

    suspend fun delete(id: PlaylistID) {
        val existingPlaylist = getByIdSafe(id)
        checkEditAccess(existingPlaylist)
        playlistsRepository.delete(id)
    }

    suspend fun getPlaylistWithVideos(id: PlaylistID): PlaylistWithVideosDto {
        val playlist = getWithAuthorByIdSafe(id)
        val videos = videoService.searchPlaylistVideos(id)

        return PlaylistWithVideosDto(
            playlist = playlist.toDto(),
            videos = videos.map { it.toDto() }
        )
    }

    suspend fun getVideoPlaylists(id: VideoID): List<PlaylistToVideoDto> {
        videoService.getByIdSafe(id)
        val currentUser = contextManager.getUser()

        val query = PlaylistRepositorySearchQuery.create(currentUser) {
            userID = currentUser.id
        }

        val videoPlaylistIds = playlistsRepository.getVideoPlaylists(id, query)
            .mapTo(mutableSetOf()) { it.playlist.id }
        val allPlaylists = playlistsRepository.searchPlaylistWithAuthor(query)

        return allPlaylists.map {
            PlaylistToVideoDto(
                playlist = it.toDto(),
                isContainsVideo = videoPlaylistIds.contains(it.playlist.id)
            )
        }
    }

    suspend fun editVideoPlaylists(id: VideoID, dto: PlaylistVideoUpdateDto) {
        videoService.getByIdSafe(id)

        val currentUser = contextManager.getUser()
        val query = PlaylistRepositorySearchQuery.create(currentUser) {
            userID = currentUser.id
        }
        val userPlaylistIds = playlistsRepository.search(query)
            .mapTo(mutableSetOf()) { it.id }

        val newPlaylistIds = dto.playlistIds.toSet()
        val wrongIds = newPlaylistIds - userPlaylistIds
        if (wrongIds.isNotEmpty()) throw WrongPlaylistsException(wrongIds)

        val playlistsToRemove = userPlaylistIds - newPlaylistIds
        playlistsRepository.deleteVideoPlaylists(id, playlistsToRemove)
        for (playlistId in newPlaylistIds) {
            playlistsRepository.upsertVideoPlaylist(id, playlistId)
        }
    }

    private suspend fun checkReadAccess(playlist: PlaylistEntity) {
        takeIf { playlist.isPublic() } ?: checkEditAccess(playlist)
    }

    private suspend fun checkEditAccess(playlist: PlaylistEntity) {
        val currentUser = contextManager.getUser()
        takeIf { playlist.userID == currentUser.id || currentUser.role == UserRole.ADMIN }
            ?: throw PlaylistNotAvailableException(playlist.id)
    }
}