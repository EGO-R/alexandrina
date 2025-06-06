package org.mirea.backend.controllers

import org.mirea.backend.config.auth.OAuth2LoginSuccessHandler
import org.mirea.backend.dto.playlists.PlaylistToVideoDto
import org.mirea.backend.dto.playlists.PlaylistVideoUpdateDto
import org.mirea.backend.dto.video.VideoCreateDto
import org.mirea.backend.dto.video.VideoDto
import org.mirea.backend.dto.video.VideoUpdateDto
import org.mirea.backend.services.playlists.PlaylistService
import org.mirea.backend.services.video.VideoSearchQuery
import org.mirea.backend.services.video.VideoService
import org.mirea.backend.utils.ids.VideoID
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*

@RestController
//@CrossOrigin(origins = ["http://localhost:3000"])
@RequestMapping("/api/videos")
class VideoController(
    private val videoService: VideoService,
    private val playlistService: PlaylistService,
) {
    private val logger = LoggerFactory.getLogger(OAuth2LoginSuccessHandler::class.java)

    @GetMapping
    suspend fun search(@ModelAttribute query: VideoSearchQuery): List<VideoDto> {
        return videoService.searchWithAuthors(query)
    }

    @GetMapping("/{id}")
    suspend fun getById(@PathVariable id: VideoID): VideoDto {
        return videoService.getWithAuthorById(id)
    }

    @PostMapping("/create")
    suspend fun create(@RequestBody dto: VideoCreateDto): VideoDto {
        logger.info("video request: $dto")
        return videoService.create(dto)
    }

    @PostMapping("/{id}/update")
    suspend fun update(@PathVariable id: VideoID, @RequestBody dto: VideoUpdateDto): VideoDto {
        return videoService.update(id, dto)
    }

    @DeleteMapping("/{id}")
    suspend fun deleteById(@PathVariable id: VideoID) {
        videoService.deleteById(id)
    }

    @GetMapping("/{id}/playlists")
    suspend fun getPlaylists(@PathVariable id: VideoID): List<PlaylistToVideoDto> =
        playlistService.getVideoPlaylists(id)

    @PostMapping("/{id}/playlists")
    suspend fun editPlaylists(@PathVariable id: VideoID, @RequestBody dto: PlaylistVideoUpdateDto): Unit =
        playlistService.editVideoPlaylists(id, dto)
}