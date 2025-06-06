package org.mirea.backend.exceptions

open class ValidationException(
    override val message: String
) : RuntimeException()