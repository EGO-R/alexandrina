package org.mirea.backend.services.user

import org.mirea.backend.dto.user.UserCreateDto
import org.mirea.backend.dto.user.UserDto
import org.mirea.backend.dto.user.UserUpdateDto
import org.mirea.backend.dto.user.toDto
import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.exceptions.UserEditNotAvailableException
import org.mirea.backend.exceptions.UserNotFoundException
import org.mirea.backend.repositories.user.UserRepository
import org.mirea.backend.repositories.user.UserRepositorySearchQuery
import org.mirea.backend.services.ContextManager
import org.mirea.backend.services.DbTransactionManager
import org.mirea.backend.utils.ids.UserID
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val contextManager: ContextManager,
    private val transactionManager: DbTransactionManager,
) {
    suspend fun getCurrent(): UserDto = contextManager.getUser().toDto()

    suspend fun getById(id: UserID) = userRepository.getById(id)

    suspend fun getByIdSafe(id: UserID) = getById(id) ?: throw UserNotFoundException(id)

    suspend fun getByEmail(email: String) = userRepository.getByEmail(email)

    suspend fun search(query: UserRepositorySearchQuery) = userRepository.search(query)

//    suspend fun update(id: UserID, userDto: UserUpdateDto): UserDto = transactionManager.transactional {
//        val user = getById(id) ?: throw UserNotFoundException(id)
//        checkAccess(user)
//
//
//    }

    suspend fun create(userDto: UserCreateDto) = userRepository.upsert(userDto.toEntity())

    suspend fun getOrCreate(userDto: UserCreateDto): UserEntity = transactionManager.transactional {
        userRepository.getByEmail(userDto.email) ?: create(userDto)
    }

    private suspend fun checkAccess(user: UserEntity) {
        val currentUser = contextManager.getUser()
        takeIf { currentUser.email == user.email || currentUser.isAdmin() } ?: throw UserEditNotAvailableException(user.id)
    }
}