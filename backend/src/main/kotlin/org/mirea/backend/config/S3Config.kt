package org.mirea.backend.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider
import software.amazon.awssdk.http.apache.ApacheHttpClient
import software.amazon.awssdk.regions.Region
import software.amazon.awssdk.services.s3.S3Client
import software.amazon.awssdk.services.s3.S3Configuration
import software.amazon.awssdk.services.s3.presigner.S3Presigner
import java.net.URI

@Configuration
class S3Config {
    @Value("\${s3.key-id}")
    private lateinit var KEY_ID: String

    @Value("\${s3.secret-key}")
    private lateinit var SECRET_KEY: String

    @Value("\${s3.region}")
    private lateinit var REGION: String

    @Value("\${s3.endpoint}")
    private lateinit var ENDPOINT: String

    @Bean
    fun s3Client(): S3Client {
        val credentials = AwsBasicCredentials.create(KEY_ID, SECRET_KEY)
        return S3Client.builder()
            .httpClient(ApacheHttpClient.create())
            .region(Region.of(REGION))
            .endpointOverride(URI.create(ENDPOINT))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .build()
    }

    @Bean
    fun s3Presigner(): S3Presigner {
        val credentials = AwsBasicCredentials.create(KEY_ID, SECRET_KEY)
        return S3Presigner.builder()
            .region(Region.of("auto"))
            .endpointOverride(URI.create(ENDPOINT))
            .credentialsProvider(StaticCredentialsProvider.create(credentials))
            .serviceConfiguration(
                S3Configuration.builder()
                    .pathStyleAccessEnabled(true)
                    .build()
            )
            .build()
    }
}