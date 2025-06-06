package org.mirea.backend.exceptions

import org.mirea.backend.utils.ids.UserID

class ContextUserNotFoundException(message: String) : RuntimeException(message)

class UserNotFoundException(userId: UserID) : RuntimeException(
    "User ${userId.value} does not exist"
)

class UserEmailNotFoundException(email: String) : RuntimeException(
    "User $email does not exist"
)

class UserEditNotAvailableException(userId: UserID) : RuntimeException(
    "User ${userId.value} edit is not available"
)

class UserAlreadyExistsException(email: String) : RuntimeException(
    "User $email already exists"
)
