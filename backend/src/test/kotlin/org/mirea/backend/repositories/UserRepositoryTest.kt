package org.mirea.backend.repositories

import kotlinx.coroutines.runBlocking
import org.assertj.core.api.Assertions
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.mirea.backend.RepositoryTest
import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.repositories.user.UserRepository
import org.mirea.backend.repositories.user.UserRepositorySearchQuery
import org.mirea.backend.utils.ids.UserID
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.jdbc.Sql

@ActiveProfiles("test")
@Sql(scripts = ["/sql/users/data.sql"])
class UserRepositoryTest : RepositoryTest() {
    @Autowired
    private lateinit var userRepository: UserRepository

    @Nested
    inner class Search{
        @Test
        fun getById() {
            val expected = UserEntity(
                id = UserID(1),
                displayName = "test1",
                email = "test1@mail.com",
                avatarUrl = null,
            )
            val actual = runBlocking {
                userRepository.getById(UserID(1))
            }
            Assertions.assertThat(actual).isEqualTo(expected)
        }

        @Test
        fun search() {
            val query = UserRepositorySearchQuery.create {
                ids = setOf(UserID(2))
            }

            val expected = listOf(
                UserEntity(
                    id = UserID(2),
                    email = "test2@mail.com",
                    displayName = "test2",
                    avatarUrl = null,
                ),
            )

            val actual = runBlocking {
                userRepository.search(query)
            }

            Assertions.assertThat(actual).isEqualTo(expected)
        }
    }

}