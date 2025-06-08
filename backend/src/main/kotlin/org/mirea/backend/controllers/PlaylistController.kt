package org.mirea.backend.controllers

import org.mirea.backend.dto.playlists.PlaylistCreateUpdateDto
import org.mirea.backend.dto.playlists.PlaylistWithVideosDto
import org.mirea.backend.services.playlists.PlaylistService
import org.mirea.backend.utils.ids.PlaylistID
import org.mirea.backend.utils.ids.UserID
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/playlists")
class PlaylistController(
    private val playlistService: PlaylistService,
) {
    @GetMapping("/users/{userId}")
    suspend fun findAll(@PathVariable userId: UserID) = playlistService.search(userId).map { it.toDto() }

    @GetMapping("/{id}")
    suspend fun getById(@PathVariable("id") id: PlaylistID): PlaylistWithVideosDto =
        playlistService.getPlaylistWithVideos(id)

    @PostMapping
    suspend fun create(@RequestBody dto: PlaylistCreateUpdateDto): PlaylistWithVideosDto =
        playlistService.create(dto)

    @PostMapping("/{id}")
    suspend fun update(
        @PathVariable("id") id: PlaylistID,
        @RequestBody dto: PlaylistCreateUpdateDto,
    ): PlaylistWithVideosDto = playlistService.update(id, dto)

    @DeleteMapping("/{id}")
    suspend fun delete(@PathVariable("id") id: PlaylistID): Unit = playlistService.delete(id)
}