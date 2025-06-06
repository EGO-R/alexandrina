package org.mirea.backend.controllers

import org.mirea.backend.dto.s3.UploadUrlDto
import org.mirea.backend.services.s3.S3Service
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/s3")
class S3Controller(
    private val s3Service: S3Service,
) {
    @GetMapping("/video")
    suspend fun getVideoUrl(): UploadUrlDto = s3Service.generatePresignedVideoUrl()

    @GetMapping("/avatar")
    suspend fun getAvatarUrl(): UploadUrlDto = s3Service.generatePresignedAvatarUrl()

    @GetMapping("/preview")
    suspend fun getPreviewUrl(): UploadUrlDto = s3Service.generatePresignedPreviewUrl()
}