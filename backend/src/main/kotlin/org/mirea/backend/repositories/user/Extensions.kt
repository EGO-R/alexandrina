package org.mirea.backend.repositories.user

import org.jooq.impl.DSL
import org.mirea.backend.jooq.generated.Tables.USERS
import org.mirea.backend.utils.repositories.andEq
import org.mirea.backend.utils.repositories.andIn
import org.mirea.backend.utils.repositories.asUserID

fun UserRepositorySearchQuery.toCondition() = DSL.noCondition()
    .andIn(USERS.ID.asUserID(), ids)
    .andEq(USERS.EMAIL, email)
