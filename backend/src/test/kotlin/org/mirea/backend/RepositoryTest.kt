package org.mirea.backend

import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.testcontainers.service.connection.ServiceConnection
import org.springframework.test.context.ActiveProfiles
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers

@ActiveProfiles("test")
@SpringBootTest
@Testcontainers
abstract class RepositoryTest {
    companion object {
        @Container
        @ServiceConnection
        val container = PostgreSQLContainer<Nothing>("postgres:15")
    }
}