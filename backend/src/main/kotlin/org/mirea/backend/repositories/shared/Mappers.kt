package org.mirea.backend.repositories.shared

import org.jooq.Record
import org.mirea.backend.entities.AuthorEntity
import org.mirea.backend.jooq.generated.Tables.USERS
import org.mirea.backend.utils.ids.UserID

internal val authorMapper = listOf(
    USERS.ID,
    USERS.NAME,
)

fun Record.toAuthorEntity() = AuthorEntity(
    id = UserID(get(USERS.ID)!!),
    name = get(USERS.NAME)!!,
)
