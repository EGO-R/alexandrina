package org.mirea.backend.services.s3

import kotlinx.coroutines.*
import kotlinx.coroutines.reactor.awaitSingle
import org.mirea.backend.dto.s3.UploadUrlDto
import org.mirea.backend.services.ContextManager
import org.mirea.backend.utils.ids.UserID
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.codec.multipart.FilePart
import org.springframework.stereotype.Service
import software.amazon.awssdk.core.sync.RequestBody
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.model.*
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest
import java.io.ByteArrayOutputStream
import java.time.Duration
import java.time.LocalDateTime
import java.util.*

@Service
class S3Service(
    private val s3Client: S3Client,
    private val presigner: S3Presigner,
    private val contextManager: ContextManager,
) {
    @Value("\${s3.bucket}")
    private lateinit var BUCKET: String

    @Value("\${s3.temp-bucket}")
    private lateinit var TEMP_BUCKET: String

    @Value("\${s3.endpoint}")
    private lateinit var ENDPOINT: String

    private val random = Random()

    private val logger = LoggerFactory.getLogger(javaClass)

    companion object {
        const val VIDEO_FILE_EXTENSION = ".mp4"
        const val IMAGE_FILE_EXTENSION = ".jpeg"

        private val presignedUrlLife = Duration.ofMinutes(5)
    }

    suspend fun generatePresignedVideoUrl(): UploadUrlDto = withContext(Dispatchers.IO) {
        val fileName = (LocalDateTime.now().nano + random.nextInt()).hashCode().toString() + VIDEO_FILE_EXTENSION
        val userId = contextManager.getUser().id
        val path = "videos/${userId.value}/$fileName"

        val request = PutObjectPresignRequest.builder()
            .signatureDuration(presignedUrlLife)
            .putObjectRequest { putObjectRequest ->
                putObjectRequest
                    .bucket(BUCKET)
                    .key(path)
                    .contentType("video/mp4")
                    .build()
            }
            .build()

        UploadUrlDto(
            url = presigner.presignPutObject(request).url().toString()
        )
    }

    suspend fun generatePresignedAvatarUrl(): UploadUrlDto = withContext(Dispatchers.IO) {
        val fileName = (LocalDateTime.now().nano + random.nextInt()).hashCode().toString() + IMAGE_FILE_EXTENSION
        val userId = contextManager.getUser().id
        val path = "avatars/${userId.value}/$fileName"

        val request = PutObjectPresignRequest.builder()
            .signatureDuration(presignedUrlLife)
            .putObjectRequest { putObjectRequest ->
                putObjectRequest
                    .bucket(BUCKET)
                    .key(path)
                    .contentType("image/jpeg")
                    .build()
            }
            .build()

        UploadUrlDto(
            url = presigner.presignPutObject(request).url().toString()
        )
    }

    suspend fun generatePresignedPreviewUrl(): UploadUrlDto = withContext(Dispatchers.IO) {
        val fileName = (LocalDateTime.now().nano + random.nextInt()).hashCode().toString() + IMAGE_FILE_EXTENSION
        val userId = contextManager.getUser().id
        val path = "previews/${userId.value}/$fileName"

        val request = PutObjectPresignRequest.builder()
            .signatureDuration(presignedUrlLife)
            .putObjectRequest { putObjectRequest ->
                putObjectRequest
                    .bucket(BUCKET)
                    .key(path)
                    .contentType("image/jpeg")
                    .build()
            }
            .build()

        UploadUrlDto(
            url = presigner.presignPutObject(request).url().toString()
        )
    }

    suspend fun uploadPreview(file: FilePart): String = withContext(Dispatchers.IO) {
        val userId = UserID(1)
        logger.info("File name: ${file.filename()}")
        val fileExtension = file.filename().substringAfterLast('.', "jpg")
        val fileName = (LocalDateTime.now().nano + random.nextInt()).hashCode().toString() + ".$fileExtension"
        val path = "previews/${userId.value}/$fileName"

        // Read file content as bytes
        val byteOutputStream = ByteArrayOutputStream()
        file.content().map { dataBuffer ->
            val bytes = ByteArray(dataBuffer.readableByteCount())
            dataBuffer.read(bytes)
            byteOutputStream.write(bytes)
            dataBuffer
        }.collectList().awaitSingle()
        
        val fileBytes = byteOutputStream.toByteArray()

        val request = PutObjectRequest.builder()
            .bucket(BUCKET)
            .key(path)
            .build()

        s3Client.putObject(request, RequestBody.fromBytes(fileBytes))
        path
    }

    suspend fun deleteFile(key: String) = withContext(Dispatchers.IO) {
        val query = DeleteObjectRequest.builder()
            .bucket(BUCKET)
            .key(key)
            .build()

        s3Client.deleteObject(query)
    }
}